import {
  type CVState,
  defaultCVState,
  parseCVState,
} from '@/types/cv'
import { type SectionKey, type DetectedSection, type ParserStats } from './heuristic/heuristicTypes'
import { detectSections, normalizeLines, uniqueValues } from './heuristic/sectionDetection'
import { extractProfile } from './heuristic/profileExtraction'
import {
  buildWorkEntries,
  buildEducationEntries,
  buildProjectEntries,
  extractSkills,
  buildLanguageEntries,
  buildCustomSections,
} from './heuristic/sectionExtraction'

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
