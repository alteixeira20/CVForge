import { 
  type CVState, 
  defaultCVState,
  parseCVState
} from '@/types/cv'

export interface HeuristicResult {
  draft: CVState
  confidence: number
  warnings: string[]
  detectedFields: string[]
}

export function parseHeuristicResume(text: string): HeuristicResult | null {
  if (!text.trim()) return null

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const draft: CVState = JSON.parse(JSON.stringify(defaultCVState))
  const detectedFields: string[] = []
  const warnings: string[] = []

  // 1. Extract Name (Heuristic: first non-empty line if it doesn't look like contact info)
  const nameCandidate = lines[0]
  if (nameCandidate && nameCandidate.length < 50 && !nameCandidate.includes('@')) {
    draft.resume.profile.name = nameCandidate
    detectedFields.push('Name')
  }

  // 2. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) {
    draft.resume.profile.email = emailMatch[0]
    detectedFields.push('Email')
  }

  // 3. Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  if (phoneMatch) {
    draft.resume.profile.phone = phoneMatch[0]
    detectedFields.push('Phone')
  }

  // 4. Extract Links
  if (text.includes('linkedin.com')) {
    const liMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/)
    if (liMatch) {
      draft.resume.profile.linkedin = liMatch[0].startsWith('http') ? liMatch[0] : `https://${liMatch[0]}`
      detectedFields.push('LinkedIn')
    }
  }
  if (text.includes('github.com')) {
    const ghMatch = text.match(/github\.com\/[a-zA-Z0-9-]+\/?/)
    if (ghMatch) {
      draft.resume.profile.github = ghMatch[0].startsWith('http') ? ghMatch[0] : `https://${ghMatch[0]}`
      detectedFields.push('GitHub')
    }
  }

  // 5. Section Heading Heuristics
  const sectionContent = splitBySections(text)
  if (sectionContent.experience) {
    draft.resume.workExperience = [{
      id: 'heuristic-work-1',
      role: 'Extracted Role',
      company: 'Extracted Company',
      bullets: sectionContent.experience.split('\n').filter(l => l.trim().length > 10).slice(0, 5),
      startDate: '',
      endDate: '',
      location: '',
      isCurrent: false
    }]
    detectedFields.push('Work Experience (Draft)')
  }

  if (sectionContent.skills) {
    draft.resume.skills.technical = sectionContent.skills
      .split(/[,|\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 30)
      .slice(0, 15)
    detectedFields.push('Skills')
  }

  // 6. Confidence Calculation
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
    detectedFields
  }
}

function splitBySections(text: string) {
  const sections: Record<string, string> = {}
  const patterns = {
    experience: /(experience|work history|employment|work)/i,
    education: /(education|academic)/i,
    projects: /(projects|personal projects)/i,
    skills: /(skills|technical skills|expertise)/i,
    languages: /(languages)/i,
  }

  let lastSection = ''

  // Very simple greedy split
  const lines = text.split('\n')
  lines.forEach(line => {
    for (const [key, regex] of Object.entries(patterns)) {
      if (regex.test(line) && line.length < 30) {
        if (lastSection) sections[lastSection] = (sections[lastSection] || '')
        lastSection = key
        return
      }
    }
    if (lastSection) {
      sections[lastSection] = (sections[lastSection] || '') + '\n' + line
    }
  })

  return sections
}

function calculateConfidence(text: string, fields: string[], sections: Record<string, string>) {
  let score = 0
  if (fields.includes('Email')) score += 20
  if (fields.includes('Phone')) score += 10
  if (fields.includes('Name')) score += 10
  if (fields.includes('LinkedIn') || fields.includes('GitHub')) score += 10
  if (sections.experience) score += 20
  if (sections.education) score += 10
  if (sections.skills) score += 10
  if (text.length > 500) score += 10

  return Math.min(100, score)
}
