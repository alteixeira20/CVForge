import { type SectionKey, type DetectedSection, type CurrentSection, type EntryLine } from './heuristicTypes'
import { extractDateRange } from './dateParsing'

export const SECTION_DEFINITIONS: Array<{ key: SectionKey; label: string; pattern: RegExp }> = [
  { key: 'summary', label: 'Summary / Profile', pattern: /^(summary|profile|about|professional summary|executive summary|resumo|perfil|perfil profissional)$/i },
  { key: 'experience', label: 'Work / Experience', pattern: /^(work experience|professional experience|experience|employment|work history|professional history|employment history|experi[eê]ncia|experi[eê]ncia profissional|historial profissional)$/i },
  { key: 'education', label: 'Education', pattern: /^(education|academic background|academic|scholastic history|forma[cç][aã]o|forma[cç][aã]o acad[eé]mica|educa[cç][aã]o|qualifica[cç][oõ]es)$/i },
  { key: 'skills', label: 'Skills', pattern: /^(skills|technical skills|core skills|expertise|technical expertise|skills & expertise|compet[eê]ncias|aptid[oõ]es|tecnologias|conhecimentos t[eé]cnicos)$/i },
  { key: 'projects', label: 'Projects', pattern: /^(projects|selected projects|personal projects|academic projects|projetos|projetos selecionados|projetos pessoais|projetos acad[eé]micos)$/i },
  { key: 'languages', label: 'Languages', pattern: /^(languages|language skills|linguistic skills|idiomas|l[ií]nguas|compet[eê]ncias lingu[ií]sticas)$/i },
  { key: 'certifications', label: 'Certifications', pattern: /^(certifications|certificates|licenses|accreditations|certifica[cç][oõ]es|certificados|acredita[cç][oõ]es)$/i },
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

// Lines before the first recognized section heading (name, contacts, and
// often an unheaded summary).
export function preambleLines(text: string) {
  const lines = normalizeLines(text)
  const firstHeading = lines.findIndex((line) => Boolean(sectionForHeading(line)))
  return firstHeading === -1 ? [] : lines.slice(0, firstHeading)
}

export function sectionForHeading(line: string) {
  const normalized = line.replace(/:$/, '').trim()
  if (normalized.length > 40) return null
  return SECTION_DEFINITIONS.find((section) => section.pattern.test(normalized)) ?? null
}

// Section content keeps the original lines, including bullet markers, so
// entry parsing can tell bullets from headings.
export function detectSections(text: string): DetectedSection[] {
  const lines = text.replace(/\r/g, '\n').split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const sections: DetectedSection[] = []
  let current: CurrentSection | null = null
  const preamble: string[] = []

  lines.forEach((line) => {
    const heading = sectionForHeading(line.replace(/\s+/g, ' '))
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

const BULLET_MARKER = /^[\u2022\u00b7\u25aa\u25e6\u2023*-]\s*/
// A bullet wrapped onto the next line fills most of the width and has no
// closing punctuation; the continuation usually starts in lower case.
const WRAPPED_LINE_MIN_LENGTH = 70

// Splits a section into lines while keeping which lines are bullets, and
// joins wrapped bullet lines back onto their bullet.
export function entryLines(content: string): EntryLine[] {
  const result: EntryLine[] = []
  for (const rawLine of content.replace(/\r/g, '\n').split(/\n+/)) {
    const line = rawLine.trim().replace(/\s+/g, ' ')
    if (line.length <= 1) continue
    const bullet = BULLET_MARKER.test(line) && line.replace(BULLET_MARKER, '').length > 1
    const text = bullet ? line.replace(BULLET_MARKER, '') : line
    const previous = result[result.length - 1]
    if (!bullet && previous?.bullet && isWrappedContinuation(previous.text, text)) {
      previous.text = `${previous.text} ${text}`
      continue
    }
    result.push({ text, bullet })
  }
  return result
}

function isWrappedContinuation(previous: string, line: string) {
  if (sectionForHeading(line)) return false
  if (startsLowerCase(line)) return true
  return previous.length >= WRAPPED_LINE_MIN_LENGTH && !/[.!?:;]$/.test(previous) && !extractDateRange(line)
}

function startsLowerCase(line: string) {
  return /^\p{Ll}/u.test(line)
}

// Groups section lines into entries. Bullets and wrapped lines never start an
// entry; a heading line after an entry's bullets, or after a complete
// title-and-date header, does.
export function splitSectionEntries(content: string): EntryLine[][] {
  const chunks: EntryLine[][] = []
  let current: EntryLine[] = []

  entryLines(content).forEach((line) => {
    if (current.length > 0 && startsNewEntry(line, current)) {
      chunks.push(current)
      current = []
    }
    current.push(line)
  })

  if (current.length) chunks.push(current)
  return chunks.filter((chunk) => chunk.some((line) => isMeaningfulLine(line.text)))
}

function startsNewEntry(line: EntryLine, current: EntryLine[]) {
  if (line.bullet || startsLowerCase(line.text)) return false
  if (current.some((candidate) => candidate.bullet)) return true
  const headers = current.map((candidate) => candidate.text)
  const hasDate = headers.some((header) => Boolean(extractDateRange(header)))
  if (!hasDate) return false
  if (extractDateRange(line.text)) return true
  // Without bullets, a header is complete once it names both a title and an
  // organization (two lines, or one "Role at Company" line) and has a date.
  const titleWeight = headers
    .map(withoutDate)
    .filter(isStrongLine)
    .reduce((total, header) => total + (COMBINED_TITLE.test(header) ? 2 : 1), 0)
  return titleWeight >= 2 && isStrongLine(line.text)
}

const COMBINED_TITLE = /\s+at\s+|\s+[|\u2013\u2014-]\s+/i

// Removes the date range (and separators around it) from a header line, for
// example "Senior Engineer | Jan 2020 - Present" -> "Senior Engineer".
export function withoutDate(line: string) {
  const date = extractDateRange(line)
  const text = date ? line.replace(date.raw, ' ') : line
  return text.replace(/\s*[|,\u2013\u2014-]\s*$/, '').replace(/^\s*[|,\u2013\u2014-]\s*/, '').replace(/\s+/g, ' ').trim()
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
  const value = line.trim()
  return /^(Remote|Hybrid)$/i.test(value) || /^\p{Lu}[\p{L} .'-]+,\s*\p{Lu}[\p{L} .'-]+$/u.test(value)
}

export function isLikelyName(line: string) {
  return line.length < 50
    && !line.includes('@')
    && !extractUrl(line)
    && !sectionForHeading(line)
    && /^\p{Lu}[\p{L}'.-]+(?:\s+\p{Lu}[\p{L}'.-]+){1,3}$/u.test(line)
}
