import { type SectionKey, type DetectedSection, type CurrentSection } from './heuristicTypes'
import { extractDateRange } from './dateParsing'

export const SECTION_DEFINITIONS: Array<{ key: SectionKey; label: string; pattern: RegExp }> = [
  { key: 'summary', label: 'Summary / Profile', pattern: /^(summary|profile|about|professional summary|executive summary)$/i },
  { key: 'experience', label: 'Work / Experience', pattern: /^(work experience|professional experience|experience|employment|work history|professional history|employment history)$/i },
  { key: 'education', label: 'Education', pattern: /^(education|academic background|academic|scholastic history)$/i },
  { key: 'skills', label: 'Skills', pattern: /^(skills|technical skills|core skills|expertise|technical expertise|skills & expertise)$/i },
  { key: 'projects', label: 'Projects', pattern: /^(projects|selected projects|personal projects|academic projects)$/i },
  { key: 'languages', label: 'Languages', pattern: /^(languages|language skills|linguistic skills)$/i },
  { key: 'certifications', label: 'Certifications', pattern: /^(certifications|certificates|licenses|accreditations)$/i },
  { key: 'awards', label: 'Awards', pattern: /^(awards|honors|awards & honors|recognition)$/i },
  { key: 'publications', label: 'Publications', pattern: /^(publications|papers|presentations)$/i },
  { key: 'volunteering', label: 'Volunteering', pattern: /^(volunteering|volunteer experience|community service)$/i },
]

export function normalizeLines(text: string) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[•·]/g, '\n')
    .split(/\n+|\t+/)
    .map((line) => line.trim().replace(/^[-\u2013\u2014*]\s*/, '').replace(/\s+/g, ' '))
    .filter((line) => line.length > 1)
    .filter((line, index, lines) => lines.findIndex((candidate) => candidate.toLowerCase() === line.toLowerCase()) === index)
}

export function sectionForHeading(line: string) {
  const normalized = line.replace(/:$/, '').trim()
  if (normalized.length > 40) return null
  return SECTION_DEFINITIONS.find((section) => section.pattern.test(normalized)) ?? null
}

export function detectSections(text: string): DetectedSection[] {
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

export function splitSectionEntries(content: string) {
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

export function extractUrl(line: string) {
  return line.match(/https?:\/\/[^\s)]+|(?:github|linkedin)\.com\/[^\s)]+/i)?.[0] ?? ''
}

export function normalizeUrl(value: string) {
  return value.startsWith('http') ? value : `https://${value}`
}

export function uniqueValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

export function isBulletLike(line: string) {
  return /^[-*]/.test(line) || line.length > 100
}

export function isStrongLine(line: string) {
  return line.length >= 3 && line.length <= 90 && !isBulletLike(line) && !isContactLine(line)
}

export function isContactLine(line: string) {
  return line.includes('@') || Boolean(extractUrl(line)) || /\+?\d[\d\s().-]{7,}/.test(line)
}

export function isMeaningfulLine(line: string) {
  return line.trim().length > 1 && !sectionForHeading(line)
}

export function isDegreeLine(line: string) {
  return /\b(Bachelor|Master|MSc|BSc|PhD|Bootcamp|Course|Diploma|Licenciatura|Mestrado|Degree)\b/i.test(line)
}

export function isLikelyLocation(line: string) {
  return /^(Remote|Hybrid)$/i.test(line.trim()) || /^[A-Z][A-Za-z .'-]+,\s*[A-Z][A-Za-z .'-]+$/.test(line.trim())
}

export function isLikelyName(line: string) {
  return line.length < 50
    && !line.includes('@')
    && !extractUrl(line)
    && !sectionForHeading(line)
    && /^[A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+){1,3}$/.test(line)
}

export function isLikelyEntryHeading(line: string, current: string[]) {
  return isStrongLine(line) && current.some((candidate) => Boolean(extractDateRange(candidate)) || isBulletLike(candidate))
}
