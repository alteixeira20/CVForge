import { 
  type CVState, 
  defaultCVState,
  parseCVState
} from '@/types/cv'

type SectionKey = 'experience' | 'education' | 'projects' | 'skills' | 'languages' | 'custom'

export interface HeuristicResult {
  draft: CVState
  confidence: number
  warnings: string[]
  detectedFields: string[]
  profileFields: string[]
  sectionSummaries: Array<{
    key: SectionKey
    label: string
    itemCount: number
    preview: string
  }>
  unmappedText: string
}

export function parseHeuristicResume(text: string): HeuristicResult | null {
  if (!text.trim()) return null

  const lines = toContentLines(text)
  const draft: CVState = JSON.parse(JSON.stringify(defaultCVState))
  const detectedFields: string[] = []
  const profileFields: string[] = []
  const warnings: string[] = []

  // Extract only obvious profile signals. Ambiguous fields stay blank.
  const nameCandidate = lines[0]
  if (nameCandidate && nameCandidate.length < 50 && !nameCandidate.includes('@') && !looksLikeSectionHeading(nameCandidate)) {
    draft.resume.profile.name = nameCandidate
    detectedFields.push('Name')
    profileFields.push('Name')
  }

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) {
    draft.resume.profile.email = emailMatch[0]
    detectedFields.push('Email')
    profileFields.push('Email')
  }

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  if (phoneMatch) {
    draft.resume.profile.phone = phoneMatch[0]
    detectedFields.push('Phone')
    profileFields.push('Phone')
  }

  if (text.includes('linkedin.com')) {
    const liMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/)
    if (liMatch) {
      draft.resume.profile.linkedin = liMatch[0].startsWith('http') ? liMatch[0] : `https://${liMatch[0]}`
      detectedFields.push('LinkedIn')
      profileFields.push('LinkedIn')
    }
  }
  if (text.includes('github.com')) {
    const ghMatch = text.match(/github\.com\/[a-zA-Z0-9-]+\/?/)
    if (ghMatch) {
      draft.resume.profile.github = ghMatch[0].startsWith('http') ? ghMatch[0] : `https://${ghMatch[0]}`
      detectedFields.push('GitHub')
      profileFields.push('GitHub')
    }
  }
  const websiteMatch = text.match(/https?:\/\/(?!.*(?:linkedin|github))[^\s)]+/i)
  if (websiteMatch) {
    draft.resume.profile.website = websiteMatch[0]
    detectedFields.push('Website')
    profileFields.push('Website')
  }

  const sectionContent = splitBySections(text)
  const sectionSummaries: HeuristicResult['sectionSummaries'] = []

  if (sectionContent.experience) {
    const bullets = toContentLines(sectionContent.experience).slice(0, 8)
    draft.resume.workExperience = [{
      id: 'heuristic-work-1',
      role: '',
      company: '',
      bullets,
      startDate: '',
      endDate: '',
      location: '',
      isCurrent: false
    }]
    detectedFields.push('Work Experience')
    sectionSummaries.push(createSectionSummary('experience', 'Work / Experience', bullets.length, bullets))
  }

  if (sectionContent.education) {
    const details = toContentLines(sectionContent.education).slice(0, 6)
    draft.resume.education = [{
      id: 'heuristic-education-1',
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      details,
    }]
    detectedFields.push('Education')
    sectionSummaries.push(createSectionSummary('education', 'Education', details.length, details))
  }

  if (sectionContent.projects) {
    const bullets = toContentLines(sectionContent.projects).slice(0, 8)
    draft.resume.projects = [{
      id: 'heuristic-project-1',
      name: '',
      link: '',
      startDate: '',
      endDate: '',
      bullets,
    }]
    detectedFields.push('Projects')
    sectionSummaries.push(createSectionSummary('projects', 'Projects', bullets.length, bullets))
  }

  if (sectionContent.skills) {
    const skills = sectionContent.skills
      .split(/[,|\n|•]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 1 && skill.length < 40 && !looksLikeSectionHeading(skill))
      .slice(0, 15)
    draft.resume.skills.technical = skills
    detectedFields.push('Skills')
    sectionSummaries.push(createSectionSummary('skills', 'Skills', skills.length, skills))
  }

  if (sectionContent.languages) {
    const languages = sectionContent.languages
      .split(/[,|\n|•]/)
      .map((language) => language.trim())
      .filter((language) => language.length > 1 && language.length < 50 && !looksLikeSectionHeading(language))
      .slice(0, 10)
    draft.resume.languages = languages.map((language, index) => ({
      id: `heuristic-language-${index + 1}`,
      name: language,
      proficiency: '',
    }))
    detectedFields.push('Languages')
    sectionSummaries.push(createSectionSummary('languages', 'Languages', languages.length, languages))
  }

  if (sectionContent.custom) {
    const bullets = toContentLines(sectionContent.custom).slice(0, 8)
    draft.resume.customSections = [{
      id: 'heuristic-custom-1',
      title: 'Additional Parsed Text',
      bullets,
    }]
    draft.settings.visibleSections.customSections = true
    detectedFields.push('Additional Parsed Text')
    sectionSummaries.push(createSectionSummary('custom', 'Custom / Unmapped', bullets.length, bullets))
  }

  const confidence = calculateConfidence(text, detectedFields, sectionContent)

  if (confidence < 20) {
    warnings.push('Low confidence: Text extraction may be garbled or structure is non-standard.')
  }

  // Validate draft
  const validated = parseCVState(draft)
  if (!validated) return null

  return {
    draft: validated,
    confidence,
    warnings,
    detectedFields,
    profileFields,
    sectionSummaries,
    unmappedText: createUnmappedSummary(text, sectionContent)
  }
}

function splitBySections(text: string): Partial<Record<SectionKey, string>> {
  const sections: Partial<Record<SectionKey, string>> = {}
  const headingPattern = /\b(work experience|professional experience|experience|work history|employment|education|academic|projects|personal projects|technical skills|skills|expertise|languages|certifications|awards|publications|volunteering|summary|profile)\b/gi
  const matches = [...text.matchAll(headingPattern)]

  matches.forEach((match, index) => {
    const rawHeading = match[0]
    const start = (match.index ?? 0) + rawHeading.length
    const end = matches[index + 1]?.index ?? text.length
    const key = sectionKeyForHeading(rawHeading)
    const content = text.slice(start, end).trim()
    if (!content) return
    sections[key] = [sections[key], content].filter(Boolean).join('\n')
  })

  return sections
}

function sectionKeyForHeading(heading: string): SectionKey {
  const value = heading.toLowerCase()
  if (value.includes('education') || value.includes('academic')) return 'education'
  if (value.includes('project')) return 'projects'
  if (value.includes('skill') || value.includes('expertise')) return 'skills'
  if (value.includes('language')) return 'languages'
  if (value.includes('experience') || value.includes('employment') || value === 'work') return 'experience'
  return 'custom'
}

function toContentLines(value: string) {
  const normalized = value
    .replace(/\r/g, '\n')
    .replace(/[•·]/g, '\n')
    .replace(/\s+-\s+/g, '\n')
    .replace(/[ \t]+/g, ' ')

  const lineCandidates = normalized
    .split(/\n+|;\s+|\.\s+/)
    .map((line) => line.trim().replace(/^[-–—*]\s*/, ''))
    .filter((line) => line.length > 1)

  return lineCandidates
    .filter((line, index, lines) => !looksLikeDuplicate(line, lines, index))
    .slice(0, 40)
}

function createSectionSummary(key: SectionKey, label: string, itemCount: number, values: string[]) {
  return {
    key,
    label,
    itemCount,
    preview: values.slice(0, 2).join(' | '),
  }
}

function createUnmappedSummary(text: string, sections: Partial<Record<SectionKey, string>>) {
  const mapped = Object.values(sections).join(' ')
  if (!mapped.trim()) return toContentLines(text).slice(0, 3).join(' | ')
  return ''
}

function looksLikeSectionHeading(value: string) {
  return /^(work experience|professional experience|experience|work history|employment|education|academic|projects|personal projects|technical skills|skills|expertise|languages|certifications|awards|publications|summary|profile)$/i.test(value.trim())
}

function looksLikeDuplicate(line: string, lines: string[], index: number) {
  const normalized = line.toLowerCase()
  return lines.findIndex((candidate) => candidate.toLowerCase() === normalized) !== index
}

function calculateConfidence(text: string, fields: string[], sections: Partial<Record<SectionKey, string>>) {
  let score = 0
  if (fields.includes('Email')) score += 20
  if (fields.includes('Phone')) score += 10
  if (fields.includes('Name')) score += 10
  if (fields.includes('LinkedIn') || fields.includes('GitHub')) score += 10
  if (sections.experience) score += 20
  if (sections.education) score += 10
  if (sections.skills) score += 10
  if (sections.projects) score += 5
  if (sections.languages) score += 5
  if (text.length > 500) score += 10

  return Math.min(100, score)
}
