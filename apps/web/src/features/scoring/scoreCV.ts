import { type CVState } from '@/types/cv'
import { createIssue, createWarning } from './scoreIssues'
import { compactnessPoints, hasLinks, hasSkills, hasVisibleUrls, metricPoints } from './scoreSignals'
import { type ScoreIssue, type ScoreResult } from './scoringTypes'

export function scoreCV(state: CVState, extractedText = '', includeExtraction = false): ScoreResult {
  const issues = buildIssues(state, extractedText, includeExtraction)
  const maxScore = issues.reduce((total, issue) => total + issue.maxPoints, 0)
  const score = issues.reduce((total, issue) => total + issue.points, 0)

  return { score: Math.round((score / maxScore) * 100), maxScore: 100, issues }
}

function buildIssues(state: CVState, extractedText: string, includeExtraction: boolean): ScoreIssue[] {
  const { profile, workExperience, education, projects } = state.resume

  const issues = [
    createIssue('name', 'Name', 'Add a clear candidate name.', Boolean(profile.name), 8),
    createIssue('email', 'Email', 'Add a reachable email address.', Boolean(profile.email), 8),
    createIssue('phone', 'Phone', 'Add a phone number for recruiter contact.', Boolean(profile.phone), 6),
    createIssue('location', 'Location', 'Add a city, region, or remote-work location.', Boolean(profile.location), 5),
    createIssue('links', 'Links', 'Add a website, GitHub, or LinkedIn URL.', hasLinks(state), 6),
    createIssue('work', 'Work Experience', 'Include at least one work experience entry.', workExperience.length > 0, 12),
    createIssue('education', 'Education', 'Include at least one education entry.', education.length > 0, 8),
    createIssue('skills-projects', 'Skills or Projects', 'Include skills or projects relevant to the role.', projects.length > 0 || hasSkills(state), 10),
    createIssue('urls', 'Visible URLs', 'Keep profile and project URLs visible in text.', hasVisibleUrls(state, extractedText), 7),
    createWarning('metrics', 'Metrics in Bullets', 'Use numbers in bullets where they are honest and useful.', metricPoints(state), 12),
    createWarning('compactness', 'Compactness', 'Keep the CV concise enough for a first screening pass.', compactnessPoints(state, extractedText), 8),
  ]

  if (includeExtraction) {
    issues.push(createIssue('extraction', 'PDF Text Extraction', 'Uploaded PDFs should expose selectable text.', Boolean(extractedText.trim()), 10))
  }

  return issues
}
