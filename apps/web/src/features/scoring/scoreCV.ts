import { type CVState } from '@/types/cv'
import { binaryIssue, measuredIssue } from './scoreIssues'
import {
  actionBulletPoints,
  compactnessPoints,
  dateAndRolePoints,
  hasLinks,
  hasRecognizableSectionTitles,
  hasSkills,
  hasVisibleUrls,
  impactBulletPoints,
  metricPoints,
  parseabilityPoints,
  summaryPoints,
} from './scoreSignals'
import {
  type ScoreDimension,
  type ScoreDimensionId,
  type ScoreIssue,
  type ScoreResult,
} from './scoringTypes'

export function scoreCV(
  state: CVState,
  extractedText = '',
  options: { includeExtraction?: boolean } = {},
): ScoreResult {
  const issues = buildIssues(state, extractedText, options.includeExtraction ?? false)
  const dimensions = buildDimensions(issues)
  const score = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.score, 0) /
      dimensions.length,
  )

  return {
    score,
    maxScore: 100,
    band: scoreBand(score),
    methodVersion: 2,
    dimensions,
    issues,
  }
}

function buildIssues(
  state: CVState,
  extractedText: string,
  includeExtraction: boolean,
): ScoreIssue[] {
  const { profile, workExperience, education, projects } = state.resume
  const summaryScore = summaryPoints(profile.summary)
  const dateRoleScore = dateAndRolePoints(state)
  const bulletScore = impactBulletPoints(state)
  const actionScore = actionBulletPoints(state)
  const metricsScore = metricPoints(state)
  const compactScore = compactnessPoints(state, extractedText)

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
      suggestion: 'Write a focused 2–4 line summary that connects your experience to the roles you want.',
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
      detected: `${actionScore.actionLed} of ${actionScore.total} bullets start with a clear action verb.`,
      why: 'Direct action language makes achievements easier to understand quickly.',
      suggestion: 'Start key bullets with a specific action verb such as built, led, improved, reduced, or delivered.',
      dimension: 'impact',
      priority: 'medium',
      points: actionScore.points,
      maxPoints: 6,
    }),
    measuredIssue({
      id: 'metrics',
      label: 'Quantified impact',
      detected: metricsScore.hasMetric
        ? 'At least one bullet contains a quantified result.'
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
      detected: hasRecognizableSectionTitles(state)
        ? 'Core sections use recognizable headings.'
        : 'One or more core section headings may be difficult to recognize.',
      why: 'Conventional headings help readers and rule-based extractors identify content.',
      suggestion: 'Use clear headings such as Experience, Education, Projects, and Skills.',
      dimension: 'ats-compatibility',
      priority: 'medium',
      passed: hasRecognizableSectionTitles(state),
      maxPoints: 8,
    }),
  ]

  if (includeExtraction) {
    const parseScore = parseabilityPoints(extractedText)
    issues.push(measuredIssue({
      id: 'selectable-text',
      label: 'Selectable text',
      detected: parseScore.detected,
      why: 'ATS-style extraction depends on readable text rather than only page images.',
      suggestion: 'Export a text-based PDF and avoid flattening the document into an image.',
      dimension: 'parseability',
      priority: 'high',
      points: parseScore.points,
      maxPoints: 10,
    }))
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

function buildDimensions(issues: ScoreIssue[]): ScoreDimension[] {
  const ids = Array.from(new Set(issues.map((issue) => issue.dimension)))
  return ids.map((id) => {
    const dimensionIssues = issues.filter((issue) => issue.dimension === id)
    const points = dimensionIssues.reduce((total, issue) => total + issue.points, 0)
    const maxPoints = dimensionIssues.reduce((total, issue) => total + issue.maxPoints, 0)
    return {
      id,
      label: DIMENSION_DETAILS[id].label,
      score: Math.round((points / maxPoints) * 100),
      summary: DIMENSION_DETAILS[id].summary,
    }
  })
}

function scoreBand(score: number): ScoreResult['band'] {
  if (score >= 85) return 'Strong signals'
  if (score >= 70) return 'Solid foundation'
  if (score >= 50) return 'Needs attention'
  return 'Limited signals'
}
