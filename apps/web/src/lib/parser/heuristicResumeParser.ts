import {
  type CVState,
  defaultCVState,
  parseCVState,
} from '@/types/cv'

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'awards'
  | 'publications'
  | 'volunteering'
  | 'custom'

interface DetectedSection {
  key: SectionKey
  label: string
  content: string
}

interface DateRange {
  startDate: string
  endDate: string
  isCurrent: boolean
  raw: string
}

interface CurrentSection {
  key: SectionKey
  label: string
  lines: string[]
}

interface ParserStats {
  workEntries: number
  educationEntries: number
  projectEntries: number
  dateRanges: number
  customSections: number
  unmappedLines: number
}

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
  stats: ParserStats
}

const SECTION_DEFINITIONS: Array<{ key: SectionKey; label: string; pattern: RegExp }> = [
  { key: 'summary', label: 'Summary / Profile', pattern: /^(summary|profile|about)$/i },
  { key: 'experience', label: 'Work / Experience', pattern: /^(work experience|professional experience|experience|employment|work history)$/i },
  { key: 'education', label: 'Education', pattern: /^(education|academic background|academic)$/i },
  { key: 'skills', label: 'Skills', pattern: /^(skills|technical skills|core skills|expertise)$/i },
  { key: 'projects', label: 'Projects', pattern: /^(projects|selected projects|personal projects)$/i },
  { key: 'languages', label: 'Languages', pattern: /^languages$/i },
  { key: 'certifications', label: 'Certifications', pattern: /^(certifications|certificates)$/i },
  { key: 'awards', label: 'Awards', pattern: /^awards$/i },
  { key: 'publications', label: 'Publications', pattern: /^publications$/i },
  { key: 'volunteering', label: 'Volunteering', pattern: /^(volunteering|volunteer experience)$/i },
]

export function parseHeuristicResume(text: string): HeuristicResult | null {
  if (!text.trim()) return null

  const draft: CVState = JSON.parse(JSON.stringify(defaultCVState))
  const lines = normalizeLines(text)
  const sections = detectSections(text)
  const detectedFields: string[] = []
  const profileFields: string[] = []
  const warnings: string[] = []
  const stats: ParserStats = {
    workEntries: 0,
    educationEntries: 0,
    projectEntries: 0,
    dateRanges: 0,
    customSections: 0,
    unmappedLines: 0,
  }

  extractProfile(text, lines, draft, detectedFields, profileFields)

  const summary = sections.find((section) => section.key === 'summary')
  if (summary && !draft.resume.profile.summary) {
    draft.resume.profile.summary = normalizeLines(summary.content).slice(0, 3).join(' ')
    if (draft.resume.profile.summary) detectedFields.push('Summary')
  }

  const workSections = sections.filter((section) => section.key === 'experience')
  draft.resume.workExperience = workSections.flatMap((section) => buildWorkEntries(section.content, stats))
  if (draft.resume.workExperience.length) detectedFields.push('Work Experience')

  const educationSections = sections.filter((section) => section.key === 'education')
  draft.resume.education = educationSections.flatMap((section) => buildEducationEntries(section.content, stats))
  if (draft.resume.education.length) detectedFields.push('Education')

  const projectSections = sections.filter((section) => section.key === 'projects')
  draft.resume.projects = projectSections.flatMap((section) => buildProjectEntries(section.content, stats))
  if (draft.resume.projects.length) detectedFields.push('Projects')

  const skills = sections
    .filter((section) => section.key === 'skills')
    .flatMap((section) => extractSkills(section.content))
  draft.resume.skills.technical = uniqueValues(skills).slice(0, 24)
  if (draft.resume.skills.technical.length) detectedFields.push('Skills')

  const languages = sections
    .filter((section) => section.key === 'languages')
    .flatMap((section) => buildLanguageEntries(section.content))
  draft.resume.languages = languages
  if (draft.resume.languages.length) detectedFields.push('Languages')

  draft.resume.customSections = buildCustomSections(sections, stats)
  if (draft.resume.customSections.length) {
    draft.settings.visibleSections.customSections = true
    detectedFields.push('Additional Sections')
  }

  const sectionSummaries = createSectionSummaries(draft, sections, stats)
  const unmappedText = createUnmappedSummary(text, sections)
  stats.unmappedLines = unmappedText ? normalizeLines(unmappedText).length : 0
  warnings.push(...createWarnings(draft, sections, stats, unmappedText))

  const confidence = calculateConfidence(profileFields, sections, stats, text)
  const validated = parseCVState(draft)
  if (!validated) return null

  return {
    draft: validated,
    confidence,
    warnings,
    detectedFields,
    profileFields,
    sectionSummaries,
    unmappedText,
    stats,
  }
}

function normalizeLines(text: string) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[•·]/g, '\n')
    .split(/\n+|\t+/)
    .map((line) => line.trim().replace(/^[-\u2013\u2014*]\s*/, '').replace(/\s+/g, ' '))
    .filter((line) => line.length > 1)
    .filter((line, index, lines) => lines.findIndex((candidate) => candidate.toLowerCase() === line.toLowerCase()) === index)
}

function detectSections(text: string): DetectedSection[] {
  const lines = normalizeLines(text)
  const sections: DetectedSection[] = []
  let current: CurrentSection | null = null
  const preamble: string[] = []

  lines.forEach((line) => {
    const heading = sectionForHeading(line)
    if (heading) {
      pushCurrentSection(sections, current)
      current = { ...heading, lines: [] }
      return
    }

    if (current) current.lines.push(line)
    else preamble.push(line)
  })

  pushCurrentSection(sections, current)
  if (sections.length === 0 && preamble.length) {
    sections.push({ key: 'custom', label: 'Unmapped Text', content: preamble.join('\n') })
  }

  return sections.filter((section) => section.content.trim())
}

function pushCurrentSection(sections: DetectedSection[], current: CurrentSection | null) {
  if (!current) return
  sections.push({
    key: current.key,
    label: current.label,
    content: current.lines.join('\n'),
  })
}

function sectionForHeading(line: string) {
  const normalized = line.replace(/:$/, '').trim()
  if (normalized.length > 40) return null
  return SECTION_DEFINITIONS.find((section) => section.pattern.test(normalized)) ?? null
}

function extractProfile(
  text: string,
  lines: string[],
  draft: CVState,
  detectedFields: string[],
  profileFields: string[],
) {
  const nameCandidate = lines.find((line) => isLikelyName(line))
  if (nameCandidate) addProfileField('Name', profileFields, detectedFields, () => { draft.resume.profile.name = nameCandidate })

  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
  if (email) addProfileField('Email', profileFields, detectedFields, () => { draft.resume.profile.email = email })

  const phone = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0]
  if (phone) addProfileField('Phone', profileFields, detectedFields, () => { draft.resume.profile.phone = phone })

  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (linkedin) addProfileField('LinkedIn', profileFields, detectedFields, () => { draft.resume.profile.linkedin = normalizeUrl(linkedin) })

  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (github) addProfileField('GitHub', profileFields, detectedFields, () => { draft.resume.profile.github = normalizeUrl(github) })

  const website = text.match(/https?:\/\/(?!.*(?:linkedin|github))[^\s)]+/i)?.[0]
  if (website) addProfileField('Website', profileFields, detectedFields, () => { draft.resume.profile.website = website })
}

function addProfileField(label: string, profileFields: string[], detectedFields: string[], apply: () => void) {
  apply()
  profileFields.push(label)
  detectedFields.push(label)
}

function splitSectionEntries(content: string) {
  const lines = normalizeLines(content)
  const chunks: string[][] = []
  let current: string[] = []

  lines.forEach((line) => {
    const startsNewEntry = current.length > 0 && (Boolean(extractDateRange(line)) || isLikelyEntryHeading(line, current))
    if (startsNewEntry) {
      chunks.push(current)
      current = []
    }
    current.push(line)
  })

  if (current.length) chunks.push(current)
  return chunks.filter((chunk) => chunk.some(isMeaningfulLine))
}

function extractDateRange(line: string): DateRange | null {
  const datePart = String.raw`(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}\/\d{1,2}|\d{4}|Present|Current|Now`
  const range = new RegExp(`(${datePart})\\s*(?:-|to)\\s*(${datePart})`, 'i').exec(line)
  if (range) return toDateRange(range[1], range[2], range[0])

  const single = new RegExp(`\\b(${datePart})\\b`, 'i').exec(line)
  if (!single) return null
  return toDateRange(single[1], '', single[0])
}

function toDateRange(start: string, end: string, raw: string): DateRange {
  const normalizedEnd = normalizePresent(end)
  return {
    startDate: normalizePresent(start),
    endDate: normalizedEnd,
    isCurrent: normalizedEnd === 'Present',
    raw,
  }
}

function normalizePresent(value: string) {
  return /^(present|current|now)$/i.test(value.trim()) ? 'Present' : value.trim()
}

function buildWorkEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const date = firstDate(chunk)
    if (date) stats.dateRanges += 1
    const cleaned = chunk.filter((line) => !isOnlyDateLine(line, date?.raw))
    const titleLine = extractLikelyTitleLine(cleaned)
    const split = titleLine ? splitRoleCompany(titleLine) : null
    const role = split?.role ?? titleLine ?? ''
    const company = split?.company ?? extractLikelyOrganizationLine(cleaned, role)
    const location = extractLocation(cleaned)
    const bullets = remainingLines(cleaned, [role, company, location, titleLine ?? '']).slice(0, 8)
    stats.workEntries += 1

    return {
      id: `heuristic-work-${index + 1}`,
      role,
      company,
      location,
      startDate: date?.startDate ?? '',
      endDate: date?.endDate ?? '',
      isCurrent: date?.isCurrent ?? false,
      bullets,
    }
  }).filter((item) => item.role || item.company || item.location || item.startDate || item.endDate || item.bullets.length)
}

function buildEducationEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const date = firstDate(chunk)
    if (date) stats.dateRanges += 1
    const cleaned = chunk.filter((line) => !isOnlyDateLine(line, date?.raw))
    const degree = cleaned.find(isDegreeLine) ?? ''
    const school = extractLikelyOrganizationLine(cleaned, degree)
    const location = extractLocation(cleaned)
    const details = remainingLines(cleaned, [degree, school, location]).slice(0, 6)
    stats.educationEntries += 1

    return {
      id: `heuristic-education-${index + 1}`,
      school,
      degree,
      location,
      startDate: date?.startDate ?? '',
      endDate: date?.endDate ?? '',
      details,
    }
  }).filter((item) => item.school || item.degree || item.location || item.startDate || item.endDate || item.details.length)
}

function buildProjectEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const date = firstDate(chunk)
    if (date) stats.dateRanges += 1
    const link = chunk.map(extractUrl).find(Boolean) ?? ''
    const cleaned = chunk.filter((line) => !isOnlyDateLine(line, date?.raw))
    const name = extractLikelyTitleLine(cleaned.filter((line) => line !== link)) ?? ''
    const bullets = remainingLines(cleaned, [name, link]).slice(0, 8)
    stats.projectEntries += 1

    return {
      id: `heuristic-project-${index + 1}`,
      name,
      link,
      startDate: date?.startDate ?? '',
      endDate: date?.endDate ?? '',
      bullets,
    }
  }).filter((item) => item.name || item.link || item.startDate || item.endDate || item.bullets.length)
}

function extractSkills(content: string) {
  return uniqueValues(content
    .split(/[,|;\n•]+/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 1 && skill.length < 40)
    .filter((skill) => !sectionForHeading(skill))
    .filter((skill) => !extractDateRange(skill)))
}

function buildLanguageEntries(content: string) {
  return uniqueValues(content
    .split(/[,|;\n•]+/)
    .map((language) => language.trim())
    .filter((language) => language.length > 1 && language.length < 50)
    .filter((language) => !sectionForHeading(language)))
    .map((language, index) => {
      const match = /^(.+?)\s*[-:]\s*(.+)$/.exec(language)
      return {
        id: `heuristic-language-${index + 1}`,
        name: (match?.[1] ?? language).trim(),
        proficiency: (match?.[2] ?? '').trim(),
      }
    })
}

function buildCustomSections(sections: DetectedSection[], stats: ParserStats) {
  const customKeys: SectionKey[] = ['certifications', 'awards', 'publications', 'volunteering', 'custom']
  return sections
    .filter((section) => customKeys.includes(section.key))
    .map((section, index) => {
      const bullets = normalizeLines(section.content).slice(0, 10)
      stats.customSections += 1
      return {
        id: `heuristic-custom-${index + 1}`,
        title: section.label,
        bullets,
      }
    })
    .filter((section) => section.bullets.length)
}

function firstDate(lines: string[]) {
  return lines.map(extractDateRange).find(Boolean) ?? null
}

function extractLikelyTitleLine(lines: string[]) {
  return lines.find((line) => isStrongLine(line) && !extractDateRange(line) && !extractUrl(line) && !isLikelyLocation(line)) ?? ''
}

function extractLikelyOrganizationLine(lines: string[], exclude = '') {
  return lines.find((line) => line !== exclude && isStrongLine(line) && !extractDateRange(line) && !extractUrl(line) && !isLikelyLocation(line)) ?? ''
}

function extractLocation(lines: string[]) {
  return lines.find(isLikelyLocation) ?? ''
}

function splitRoleCompany(line: string) {
  const atMatch = /^(.+?)\s+at\s+(.+)$/i.exec(line)
  if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() }

  const dashMatch = /^(.+?)\s+-\s+(.+)$/.exec(line)
  if (dashMatch && !extractDateRange(line)) return { role: dashMatch[1].trim(), company: dashMatch[2].trim() }

  return null
}

function remainingLines(lines: string[], usedValues: string[]) {
  const used = new Set(usedValues.filter(Boolean).map((value) => value.toLowerCase()))
  return lines
    .filter(isMeaningfulLine)
    .filter((line) => !used.has(line.toLowerCase()))
    .filter((line) => !extractDateRange(line))
    .filter((line) => !isContactLine(line))
}

function isLikelyName(line: string) {
  return line.length < 50
    && !line.includes('@')
    && !extractUrl(line)
    && !sectionForHeading(line)
    && /^[A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+){1,3}$/.test(line)
}

function isLikelyEntryHeading(line: string, current: string[]) {
  return isStrongLine(line) && current.some((candidate) => Boolean(extractDateRange(candidate)) || isBulletLike(candidate))
}

function isStrongLine(line: string) {
  return line.length >= 3 && line.length <= 90 && !isBulletLike(line) && !isContactLine(line)
}

function isBulletLike(line: string) {
  return /^[-*]/.test(line) || line.length > 100
}

function isMeaningfulLine(line: string) {
  return line.trim().length > 1 && !sectionForHeading(line)
}

function isOnlyDateLine(line: string, dateRaw?: string) {
  if (!dateRaw) return false
  return line.trim().toLowerCase() === dateRaw.trim().toLowerCase()
}

function isContactLine(line: string) {
  return line.includes('@') || Boolean(extractUrl(line)) || /\+?\d[\d\s().-]{7,}/.test(line)
}

function isDegreeLine(line: string) {
  return /\b(Bachelor|Master|MSc|BSc|PhD|Bootcamp|Course|Diploma|Licenciatura|Mestrado|Degree)\b/i.test(line)
}

function isLikelyLocation(line: string) {
  return /^(Remote|Hybrid)$/i.test(line.trim()) || /^[A-Z][A-Za-z .'-]+,\s*[A-Z][A-Za-z .'-]+$/.test(line.trim())
}

function extractUrl(line: string) {
  return line.match(/https?:\/\/[^\s)]+|(?:github|linkedin)\.com\/[^\s)]+/i)?.[0] ?? ''
}

function normalizeUrl(value: string) {
  return value.startsWith('http') ? value : `https://${value}`
}

function uniqueValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function createSectionSummaries(draft: CVState, sections: DetectedSection[], stats: ParserStats): HeuristicResult['sectionSummaries'] {
  const summaries: HeuristicResult['sectionSummaries'] = []
  if (draft.resume.workExperience.length) summaries.push(createSectionSummary('experience', 'Work / Experience', draft.resume.workExperience.length, draft.resume.workExperience.flatMap((item) => [item.role, item.company, ...item.bullets])))
  if (draft.resume.education.length) summaries.push(createSectionSummary('education', 'Education', draft.resume.education.length, draft.resume.education.flatMap((item) => [item.degree, item.school, ...item.details])))
  if (draft.resume.projects.length) summaries.push(createSectionSummary('projects', 'Projects', draft.resume.projects.length, draft.resume.projects.flatMap((item) => [item.name, item.link, ...item.bullets])))
  if (draft.resume.skills.technical.length) summaries.push(createSectionSummary('skills', 'Skills', draft.resume.skills.technical.length, draft.resume.skills.technical))
  if (draft.resume.languages.length) summaries.push(createSectionSummary('languages', 'Languages', draft.resume.languages.length, draft.resume.languages.map((item) => [item.name, item.proficiency].filter(Boolean).join(' - '))))
  if (draft.resume.customSections.length) summaries.push(createSectionSummary('custom', 'Custom / Unmapped', stats.customSections, draft.resume.customSections.flatMap((item) => [item.title, ...item.bullets])))
  if (summaries.length === 0 && sections.length) summaries.push(createSectionSummary('custom', 'Detected Text', sections.length, sections.map((section) => section.label)))
  return summaries
}

function createSectionSummary(key: SectionKey, label: string, itemCount: number, values: string[]) {
  return {
    key,
    label,
    itemCount,
    preview: values.filter(Boolean).slice(0, 2).join(' | '),
  }
}

function createUnmappedSummary(text: string, sections: DetectedSection[]) {
  if (sections.length) return ''
  return normalizeLines(text).slice(0, 4).join(' | ')
}

function createWarnings(draft: CVState, sections: DetectedSection[], stats: ParserStats, unmappedText: string) {
  const warnings: string[] = ['Review all imported fields before using the CV.']
  const entryCount = stats.workEntries + stats.educationEntries + stats.projectEntries

  if (entryCount > 1) warnings.push('Some entries were split from dates and headings.')
  if (stats.dateRanges === 0) warnings.push('No clear date ranges were detected.')
  if (hasBlankImportantFields(draft)) warnings.push('Uncertain fields were left blank.')
  if (sections.length === 0 || unmappedText) warnings.push('Large unmapped text may need manual cleanup.')

  return warnings
}

function hasBlankImportantFields(draft: CVState) {
  return draft.resume.workExperience.some((item) => !item.role || !item.company)
    || draft.resume.education.some((item) => !item.degree || !item.school)
    || draft.resume.projects.some((item) => !item.name)
}

function calculateConfidence(profileFields: string[], sections: DetectedSection[], stats: ParserStats, text: string) {
  let score = 0
  score += Math.min(profileFields.length * 8, 32)
  score += Math.min(sections.length * 7, 28)
  score += Math.min((stats.workEntries + stats.educationEntries + stats.projectEntries) * 8, 24)
  score += Math.min(stats.dateRanges * 4, 12)
  if (text.length > 500) score += 4
  return Math.min(100, score)
}
