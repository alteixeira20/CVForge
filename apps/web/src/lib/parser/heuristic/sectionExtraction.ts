import {
  type DateRange,
  type DetectedSection,
  type EntryLine,
  type ParserStats,
  type SectionKey,
} from './heuristicTypes'
import { extractDateRange, firstDate } from './dateParsing'
import {
  normalizeLines,
  splitSectionEntries,
  entryLines,
  sectionForHeading,
  extractUrl,
  uniqueValues,
  isStrongLine,
  isLikelyLocation,
  isMeaningfulLine,
  isContactLine,
  isDegreeLine,
  withoutDate,
} from './sectionDetection'

export function buildWorkEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const entry = readEntry(chunk)
    if (entry.date) stats.dateRanges += 1
    const { role, company } = assignTitleAndOrganization(entry.titles, entry.datedTitle, isRoleLike)
    stats.workEntries += 1

    return {
      id: `heuristic-work-${index + 1}`,
      role,
      company,
      location: entry.location,
      startDate: entry.date?.startDate ?? '',
      endDate: entry.date?.endDate ?? '',
      isCurrent: entry.date?.isCurrent ?? false,
      bullets: [...entry.extraTitles(entry.titles), ...entry.bullets].slice(0, 8),
    }
  }).filter((item) => item.role || item.company || item.location || item.startDate || item.endDate || item.bullets.length)
}

export function buildEducationEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const entry = readEntry(chunk)
    if (entry.date) stats.dateRanges += 1
    const { role: degree, company: school } = assignTitleAndOrganization(entry.titles, entry.datedTitle, isDegreeLike)
    stats.educationEntries += 1

    return {
      id: `heuristic-education-${index + 1}`,
      school,
      degree,
      location: entry.location,
      startDate: entry.date?.startDate ?? '',
      endDate: entry.date?.endDate ?? '',
      details: [...entry.extraTitles(entry.titles), ...entry.bullets].slice(0, 6),
    }
  }).filter((item) => item.school || item.degree || item.location || item.startDate || item.endDate || item.details.length)
}

export function buildProjectEntries(content: string, stats: ParserStats) {
  return splitSectionEntries(content).map((chunk, index) => {
    const entry = readEntry(chunk)
    if (entry.date) stats.dateRanges += 1
    const name = entry.titles[0] ?? ''
    stats.projectEntries += 1

    return {
      id: `heuristic-project-${index + 1}`,
      name,
      link: entry.link,
      startDate: entry.date?.startDate ?? '',
      endDate: entry.date?.endDate ?? '',
      bullets: [...entry.extraTitles([name]), ...entry.bullets].slice(0, 8),
    }
  }).filter((item) => item.name || item.link || item.startDate || item.endDate || item.bullets.length)
}

export function extractSkills(content: string) {
  const lines = entryLines(content).map((line) => line.text)
  return uniqueValues(lines
    .flatMap(splitOutsideParentheses)
    .map(stripCategoryLabel)
    .filter((skill) => skill.length > 1 && skill.length <= maxSkillLength(skill))
    .filter((skill) => !sectionForHeading(skill))
    .filter((skill) => !extractDateRange(skill)))
}

const SKILL_SEPARATORS = new Set([',', ';', '|', '\u2022'])

// "C (systems programming, POSIX), Python" -> ["C (systems programming, POSIX)", "Python"]
function splitOutsideParentheses(line: string) {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const character of line) {
    if (character === '(') depth += 1
    if (character === ')') depth = Math.max(0, depth - 1)
    if (depth === 0 && SKILL_SEPARATORS.has(character)) {
      parts.push(current)
      current = ''
      continue
    }
    current += character
  }
  parts.push(current)
  return parts.map((part) => part.trim().replace(/[.;,]$/, '').trim())
}

// "Technical: C" -> "C"; a bare "Technical:" label becomes empty.
function stripCategoryLabel(skill: string) {
  return skill.replace(/^[\p{L}][\p{L} &/-]{0,30}:\s*/u, '').trim()
}

// Prose is dropped, but a skill with a short parenthetical may run longer.
function maxSkillLength(skill: string) {
  return skill.includes('(') ? 70 : 40
}

export function buildLanguageEntries(content: string) {
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

export function buildCustomSections(sections: DetectedSection[], stats: ParserStats) {
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

interface ParsedEntry {
  date: DateRange | null
  titles: string[]
  datedTitle: string
  location: string
  link: string
  bullets: string[]
  extraTitles: (used: string[]) => string[]
}

// Header lines (not bullets) carry the title, organization, dates, location,
// and link. Dates inside bullets never become the entry's dates.
function readEntry(chunk: EntryLine[]): ParsedEntry {
  const headers = chunk.filter((line) => !line.bullet).map((line) => line.text)
  const date = firstDate(headers)
  const datedHeader = date ? headers.find((line) => line.includes(date.raw)) ?? '' : ''
  const link = headers.map(extractUrl).find(Boolean) ?? ''
  const residuals = headers.map(withoutDate).filter(Boolean)
  const location = residuals.find(isLikelyLocation) ?? ''
  const titles = residuals.filter((line) => line !== location && !extractUrl(line) && isStrongLine(line))
  const bullets = chunk.filter((line) => line.bullet).map((line) => line.text)

  return {
    date,
    titles: titles.slice(0, 2),
    datedTitle: datedHeader ? withoutDate(datedHeader) : '',
    location,
    link,
    bullets,
    // Header lines not used for the entry's own fields are kept as details.
    extraTitles: (used) => residuals.filter((line) => line !== location
      && !used.includes(line) && !extractUrl(line) && isMeaningfulLine(line) && !isContactLine(line)),
  }
}

// Splits "Role at Company", "Role - Company", or "Role | Company" on one line;
// otherwise picks between two header lines by keywords, and finally treats the
// dated line as the role (or degree) and the other as the organization.
function assignTitleAndOrganization(titles: string[], datedTitle: string, isTitleLike: (line: string) => boolean) {
  const [first = '', second = ''] = titles
  const combined = splitRoleCompany(first)
  if (combined && !second) return { role: combined.role, company: combined.company }
  if (!second) return { role: first, company: '' }
  if (isTitleLike(first) !== isTitleLike(second)) {
    return isTitleLike(first) ? { role: first, company: second } : { role: second, company: first }
  }
  if (datedTitle === second) return { role: second, company: first }
  return { role: first, company: second }
}

const ROLE_WORDS = /\b(engineer|developer|programmer|architect|manager|director|lead|head|chef|cook|consultant|consulting|analyst|designer|intern|internship|trainee|apprentice|assistant|associate|specialist|officer|administrator|technician|coordinator|scientist|researcher|teacher|lecturer|tutor|founder|co-founder|owner|freelancer?|contractor|accountant|nurse|writer|editor|president|supervisor|representative|operator|agent|volunteer|cto|ceo|cfo|coo|vp)\b/i
const SCHOOL_WORDS = /\b(university|college|school|institute|institution|academy|polytechnic|conservatory|campus)\b/i

function isRoleLike(line: string) {
  return ROLE_WORDS.test(line)
}

function isDegreeLike(line: string) {
  return isDegreeLine(line) || (!SCHOOL_WORDS.test(line) && /\b(engineering|science|studies|arts|design|management|economics|mathematics|informatics|computing)\b/i.test(line))
}

function splitRoleCompany(line: string) {
  const atMatch = /^(.+?)\s+at\s+(.+)$/i.exec(line)
  if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() }

  const separatorMatch = /^(.+?)\s+[|\u2013\u2014-]\s+(.+)$/.exec(line)
  if (separatorMatch) return { role: separatorMatch[1].trim(), company: separatorMatch[2].trim() }

  return null
}
