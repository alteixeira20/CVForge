import { type CVState } from '@/types/cv'
import { type PdfExtractionResult } from '@/lib/parser/pdfTextExtraction'
import { analyzeExtractionEvidence, type PdfPageEvidence } from '@/lib/parser/extractionDiagnostics'
import { binaryIssue, createIssue, measuredIssue } from './scoreIssues'
import {
  actionLanguagePoints,
  languageLabel,
  recognizableSectionHeadings,
  selectAnalyzerLanguage,
  type AnalyzerLanguage,
} from './languageDiagnostics'
import {
  compactnessPoints,
  dateAndRolePoints,
  hasLinks,
  hasSkills,
  hasVisibleUrls,
  impactBulletPoints,
  metricPoints,
  summaryPoints,
} from './scoreSignals'
import { normalizedVisibleText } from './visibleText'
import {
  type ScoreDimension,
  type ScoreDimensionId,
  type ScoreIssue,
  type ScoreResult,
} from './scoringTypes'

export function scoreCV(
  state: CVState,
  extractedText = '',
  options: {
    includeExtraction?: boolean
    extraction?: PdfExtractionResult
    language?: AnalyzerLanguage
  } = {},
): ScoreResult {
  const visibleText = normalizedVisibleText(state)
  const language = selectAnalyzerLanguage(state, visibleText, options.language)
  const includeExtraction = options.includeExtraction ?? false
  const issues = buildIssues(state, extractedText, includeExtraction, language, options.extraction)
  const dimensions = buildDimensions(issues, includeExtraction)
  const score = Math.round(dimensions.reduce(
    (total, dimension) => total + (dimension.score * dimension.weight / 100),
    0,
  ))

  return {
    score,
    maxScore: 100,
    band: scoreBand(score),
    methodVersion: 3,
    language: languageName(language),
    methodology: includeExtraction
      ? 'Weighted local checks: parseability 22%, completeness 18%, impact 18%, structure 16%, clarity 16%, and ATS-style compatibility 10%.'
      : 'Weighted local checks: completeness 23%, impact 23%, structure 20%, clarity 20%, and ATS-style compatibility 14%. Parseability is added only when a PDF is uploaded.',
    dimensions,
    issues,
  }
}

function buildIssues(
  state: CVState,
  extractedText: string,
  includeExtraction: boolean,
  language: AnalyzerLanguage,
  extraction?: PdfExtractionResult,
): ScoreIssue[] {
  const { profile, workExperience, education, projects } = state.resume
  const summaryScore = summaryPoints(profile.summary)
  const dateRoleScore = dateAndRolePoints(state)
  const bulletScore = impactBulletPoints(state)
  const actionScore = actionLanguagePoints(state, language)
  const metricsScore = metricPoints(state)
  const compactScore = compactnessPoints(state)
  const headingScore = recognizableSectionHeadings(state, language)
  const selectedLanguage = languageLabel(language)

  const issues = [
    binaryIssue({
      id: 'name',
      label: 'Candidate name',
      detected: profile.name.trim() ? 'A candidate name is present.' : 'No candidate name was detected.',
      why: 'A clear name anchors the document and its extracted record.',
      suggestion: 'Add your full professional name at the top of the CV.',
      dimension: 'completeness',
      priority: 'high',
      passed: Boolean(profile.name.trim()),
      maxPoints: 6,
    }),
    binaryIssue({
      id: 'email',
      label: 'Email address',
      detected: profile.email.trim() ? 'An email address is present.' : 'No email address was detected.',
      why: 'Recruiters need a direct, extractable contact method.',
      suggestion: 'Add a professional email address in the contact block.',
      dimension: 'completeness',
      priority: 'high',
      passed: Boolean(profile.email.trim()),
      maxPoints: 7,
    }),
    binaryIssue({
      id: 'phone',
      label: 'Phone number',
      detected: profile.phone.trim() ? 'A phone number is present.' : 'No phone number was detected.',
      why: 'Complete contact details reduce avoidable follow-up friction.',
      suggestion: 'Add a phone number with the appropriate country code.',
      dimension: 'completeness',
      priority: 'medium',
      passed: Boolean(profile.phone.trim()),
      maxPoints: 5,
    }),
    binaryIssue({
      id: 'location',
      label: 'Location',
      detected: profile.location.trim() ? 'A location is present.' : 'No location was detected.',
      why: 'A city, region, or remote-work location helps readers understand availability.',
      suggestion: 'Add a city and region, country, or a clear remote-work location.',
      dimension: 'completeness',
      priority: 'medium',
      passed: Boolean(profile.location.trim()),
      maxPoints: 4,
    }),
    binaryIssue({
      id: 'links',
      label: 'Professional links',
      detected: hasLinks(state) ? 'At least one professional link is present.' : 'No professional link was detected.',
      why: 'Relevant portfolio, LinkedIn, or GitHub links provide useful evidence.',
      suggestion: 'Add one relevant professional profile or portfolio URL.',
      dimension: 'completeness',
      priority: 'low',
      passed: hasLinks(state),
      maxPoints: 4,
    }),
    measuredIssue({
      id: 'summary',
      label: 'Professional summary',
      detected: profile.summary.trim()
        ? `A ${profile.summary.trim().length}-character summary is present.`
        : 'No professional summary was detected.',
      why: 'A concise summary gives the reader role context before detailed experience.',
      suggestion: 'Write a focused 2-4 line summary that connects your experience to the roles you want.',
      dimension: 'clarity',
      priority: 'medium',
      points: summaryScore,
      maxPoints: 8,
    }),
    binaryIssue({
      id: 'work',
      label: 'Experience section',
      detected: `${workExperience.length} experience ${workExperience.length === 1 ? 'entry was' : 'entries were'} detected.`,
      why: 'Most CV reviews depend on clear evidence of relevant experience.',
      suggestion: 'Add at least one experience entry with role, organization, dates, and outcomes.',
      dimension: 'structure',
      priority: 'high',
      passed: workExperience.length > 0,
      maxPoints: 10,
    }),
    binaryIssue({
      id: 'education',
      label: 'Education section',
      detected: `${education.length} education ${education.length === 1 ? 'entry was' : 'entries were'} detected.`,
      why: 'A recognizable education section supports completeness and reliable extraction.',
      suggestion: 'Add the most relevant education or training entry.',
      dimension: 'structure',
      priority: 'medium',
      passed: education.length > 0,
      maxPoints: 6,
    }),
    binaryIssue({
      id: 'skills-projects',
      label: 'Skills or projects',
      detected: projects.length > 0 || hasSkills(state)
        ? 'Relevant skills or projects are present.'
        : 'No skills or projects were detected.',
      why: 'Role-specific skills and project evidence improve scannability and context.',
      suggestion: 'Add a focused skills list or a project that demonstrates relevant work.',
      dimension: 'structure',
      priority: 'medium',
      passed: projects.length > 0 || hasSkills(state),
      maxPoints: 7,
    }),
    measuredIssue({
      id: 'roles-dates',
      label: 'Role and date consistency',
      detected: workExperience.length
        ? `${dateRoleScore.complete} of ${dateRoleScore.total} experience entries include a role, organization, and complete date range.`
        : 'There are no experience entries to assess.',
      why: 'Consistent role, organization, and date fields are easier to scan and extract.',
      suggestion: 'Complete the role, organization, start date, and end date or current-role marker for every entry.',
      dimension: 'clarity',
      priority: 'high',
      points: dateRoleScore.points,
      maxPoints: 10,
    }),
    measuredIssue({
      id: 'impact-bullets',
      label: 'Outcome-focused bullets',
      detected: `${bulletScore.substantive} of ${bulletScore.total} experience and project bullets contain enough detail to communicate an outcome.`,
      why: 'Specific outcome-oriented bullets show contribution more clearly than short task fragments.',
      suggestion: 'Turn short task statements into concise action, context, and result bullets.',
      dimension: 'impact',
      priority: 'high',
      points: bulletScore.points,
      maxPoints: 10,
    }),
    measuredIssue({
      id: 'action-language',
      label: 'Clear action language',
      detected: language === 'neutral'
        ? `${actionScore.total} bullets were assessed with language-neutral fallback; action-verb vocabulary was not scored as English.`
        : `${actionScore.actionLed} of ${actionScore.total} bullets start with a recognized ${selectedLanguage} action verb.`,
      why: 'Direct action language makes achievements easier to understand quickly.',
      suggestion: language === 'pt-PT'
        ? 'Comece os pontos principais com verbos de ação específicos, como liderei, desenvolvi, melhorei, reduzi ou entreguei.'
        : 'Start key bullets with a specific action verb such as built, led, improved, reduced, or delivered.',
      dimension: 'impact',
      priority: 'medium',
      points: actionScore.points,
      maxPoints: 6,
    }),
    measuredIssue({
      id: 'metrics',
      label: 'Quantified impact',
      detected: metricsScore.hasMetric
        ? `${metricsScore.matchingBullets} bullet${metricsScore.matchingBullets === 1 ? '' : 's'} contain likely measurable outcomes.`
        : 'No quantified result was detected in experience or project bullets.',
      why: 'Honest numbers can make scope and outcomes more concrete.',
      suggestion: 'Where accurate, add scale, time, quality, revenue, adoption, or efficiency measures.',
      dimension: 'impact',
      priority: 'medium',
      points: metricsScore.points,
      maxPoints: 8,
    }),
    measuredIssue({
      id: 'compactness',
      label: 'Document length signal',
      detected: compactScore.detected,
      why: 'Very long source content can make a first review harder to navigate.',
      suggestion: 'Keep the most relevant evidence and remove repeated or low-value detail.',
      dimension: 'clarity',
      priority: 'low',
      points: compactScore.points,
      maxPoints: 6,
    }),
    binaryIssue({
      id: 'urls',
      label: 'Visible URLs',
      detected: hasVisibleUrls(state, extractedText)
        ? 'Professional URLs are available as visible text.'
        : 'No visible professional URL was detected.',
      why: 'Visible URLs remain understandable when link annotations are removed during extraction.',
      suggestion: 'Show the readable domain or full URL instead of hiding every link behind generic text.',
      dimension: 'ats-compatibility',
      priority: 'low',
      passed: hasVisibleUrls(state, extractedText),
      maxPoints: 6,
    }),
    binaryIssue({
      id: 'section-headings',
      label: 'Recognizable section headings',
      detected: headingScore.recognized
        ? headingScore.fallback
          ? 'Core section titles are present; language-neutral fallback did not judge their vocabulary.'
          : `Core sections use headings recognized for ${selectedLanguage}.`
        : 'One or more core section headings may be difficult to recognize.',
      why: 'Conventional headings help readers and rule-based extractors identify content.',
      suggestion: language === 'pt-PT'
        ? 'Use títulos claros como Experiência Profissional, Formação Académica, Projetos e Competências.'
        : 'Use clear headings such as Experience, Education, Projects, and Skills.',
      dimension: 'ats-compatibility',
      priority: 'medium',
      passed: headingScore.recognized,
      maxPoints: 8,
    }),
  ]

  if (includeExtraction) {
    const diagnostics = extraction?.diagnostics
      ?? analyzeExtractionEvidence(fallbackPages(extraction, extractedText))
    issues.push(...diagnostics.signals.map((signal) => createIssue({
      ...signal,
      id: `extraction-${signal.id}`,
      dimension: 'parseability',
    })))
  }

  return issues
}

const DIMENSION_DETAILS: Record<ScoreDimensionId, { label: string; summary: string }> = {
  completeness: {
    label: 'Completeness',
    summary: 'Core identity and contact details expected in a professional CV.',
  },
  structure: {
    label: 'Structure',
    summary: 'Recognizable sections and entries that make the document easy to navigate.',
  },
  clarity: {
    label: 'Clarity',
    summary: 'Consistent dates, roles, summary context, and manageable content length.',
  },
  impact: {
    label: 'Impact',
    summary: 'Bullets that communicate actions, outcomes, and honest measures.',
  },
  'ats-compatibility': {
    label: 'ATS-style compatibility',
    summary: 'Best-practice signals for headings and visible link text.',
  },
  parseability: {
    label: 'Parseability',
    summary: 'Whether the uploaded PDF exposes enough selectable text for local extraction.',
  },
}

const DIMENSION_WEIGHTS: Record<'builder' | 'pdf', Record<ScoreDimensionId, number>> = {
  builder: {
    completeness: 23,
    structure: 20,
    clarity: 20,
    impact: 23,
    'ats-compatibility': 14,
    parseability: 0,
  },
  pdf: {
    completeness: 18,
    structure: 16,
    clarity: 16,
    impact: 18,
    'ats-compatibility': 10,
    parseability: 22,
  },
}

function buildDimensions(issues: ScoreIssue[], includeExtraction: boolean): ScoreDimension[] {
  const ids = Array.from(new Set(issues.map((issue) => issue.dimension)))
  return ids.map((id) => {
    const dimensionIssues = issues.filter((issue) => issue.dimension === id)
    const points = dimensionIssues.reduce((total, issue) => total + issue.points, 0)
    const maxPoints = dimensionIssues.reduce((total, issue) => total + issue.maxPoints, 0)
    return {
      id,
      label: DIMENSION_DETAILS[id].label,
      score: Math.round((points / maxPoints) * 100),
      weight: DIMENSION_WEIGHTS[includeExtraction ? 'pdf' : 'builder'][id],
      summary: DIMENSION_DETAILS[id].summary,
    }
  })
}

function fallbackPages(extraction: PdfExtractionResult | undefined, extractedText: string): PdfPageEvidence[] {
  const pageTexts = extraction?.pageTexts?.length ? extraction.pageTexts : [extractedText]
  return pageTexts.map((text) => {
    const lines = text.split('\n').filter(Boolean)
    return {
      text,
      lineCount: lines.length,
      itemCount: lines.length,
      fragmentedLineRatio: lines.length
        ? lines.filter((line) => line.trim().length < 20).length / lines.length
        : 0,
      possibleColumnOrder: false,
    }
  })
}

function languageName(language: AnalyzerLanguage): ScoreResult['language'] {
  if (language === 'en') return 'English'
  if (language === 'pt-PT') return 'Portuguese (Portugal)'
  return 'Language-neutral fallback'
}

function scoreBand(score: number): ScoreResult['band'] {
  if (score >= 85) return 'Strong signals'
  if (score >= 70) return 'Solid foundation'
  if (score >= 50) return 'Needs attention'
  return 'Limited signals'
}
