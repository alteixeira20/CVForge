import { type DetectedSection, type ParserStats, type SectionKey } from './heuristicTypes'
import { extractDateRange, firstDate, isOnlyDateLine } from './dateParsing'
import {
  normalizeLines,
  splitSectionEntries,
  sectionForHeading,
  extractUrl,
  uniqueValues,
  isStrongLine,
  isLikelyLocation,
  isMeaningfulLine,
  isContactLine,
  isDegreeLine,
} from './sectionDetection'

export function buildWorkEntries(content: string, stats: ParserStats) {
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

export function buildEducationEntries(content: string, stats: ParserStats) {
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

export function buildProjectEntries(content: string, stats: ParserStats) {
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

export function extractSkills(content: string) {
  return uniqueValues(content
    .split(/[,|;\n•]+/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 1 && skill.length < 40)
    .filter((skill) => !sectionForHeading(skill))
    .filter((skill) => !extractDateRange(skill)))
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
