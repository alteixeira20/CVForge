import { type CVState } from '@/types/cv'

export function hasLinks(state: CVState) {
  const { website, github, linkedin } = state.resume.profile
  return Boolean(website || github || linkedin)
}

export function hasSkills(state: CVState) {
  const { skills } = state.resume
  return skills.featuredWithRating.length > 0 || skills.technical.length > 0 || skills.soft.length > 0
}

export function hasVisibleUrls(state: CVState, text: string) {
  const links = collectLinks(state).filter(Boolean)
  if (!text.trim()) return links.length > 0
  const normalizedText = text.toLowerCase()
  return links.some((link) => {
    const normalizedLink = link.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
    return normalizedText.includes(link.toLowerCase()) || normalizedText.includes(normalizedLink)
  })
}

export function metricPoints(state: CVState) {
  const hasMetric = collectBullets(state).some((bullet) => /\d/.test(bullet))
  return { hasMetric, points: hasMetric ? 8 : 2 }
}

export function compactnessPoints(state: CVState, text: string) {
  const sourceLength = text.trim().length || JSON.stringify(state.resume).length
  if (sourceLength < 6000) {
    return { points: 6, detected: `The analyzed source contains about ${sourceLength} characters.` }
  }
  if (sourceLength < 9000) {
    return { points: 4, detected: `The analyzed source contains about ${sourceLength} characters and may benefit from trimming.` }
  }
  return { points: 1, detected: `The analyzed source contains about ${sourceLength} characters and appears unusually long.` }
}

export function summaryPoints(summary: string) {
  const length = summary.trim().length
  if (length >= 80 && length <= 600) return 8
  if (length >= 40 && length <= 800) return 4
  return 0
}

export function dateAndRolePoints(state: CVState) {
  const entries = state.resume.workExperience
  const complete = entries.filter((entry) => (
    entry.role.trim() &&
    entry.company.trim() &&
    entry.startDate.trim() &&
    (entry.isCurrent || entry.endDate.trim())
  )).length
  if (!entries.length) return { points: 0, complete: 0, total: 0 }
  const ratio = complete / entries.length
  return {
    points: ratio === 1 ? 10 : ratio >= 0.5 ? 5 : 0,
    complete,
    total: entries.length,
  }
}

export function impactBulletPoints(state: CVState) {
  const bullets = collectBullets(state).filter((bullet) => bullet.trim())
  const substantive = bullets.filter((bullet) => bullet.trim().length >= 45).length
  if (!bullets.length) return { points: 0, substantive: 0, total: 0 }
  const ratio = substantive / bullets.length
  return {
    points: ratio >= 0.75 ? 10 : ratio >= 0.4 ? 5 : substantive > 0 ? 2 : 0,
    substantive,
    total: bullets.length,
  }
}

export function actionBulletPoints(state: CVState) {
  const bullets = collectBullets(state).filter((bullet) => bullet.trim())
  const actionPattern = /^(built|created|delivered|designed|developed|drove|improved|increased|launched|led|managed|optimized|reduced|resolved|scaled|shipped|streamlined|implemented|automated|coordinated|owned)\b/i
  const actionLed = bullets.filter((bullet) => actionPattern.test(bullet.trim())).length
  if (!bullets.length) return { points: 0, actionLed: 0, total: 0 }
  const ratio = actionLed / bullets.length
  return {
    points: ratio >= 0.6 ? 6 : ratio >= 0.3 ? 3 : actionLed > 0 ? 1 : 0,
    actionLed,
    total: bullets.length,
  }
}

export function hasRecognizableSectionTitles(state: CVState) {
  const titles = state.settings.sectionTitles
  const patterns = {
    workExperience: /\b(experience|employment|work)\b/i,
    education: /\b(education|training|qualifications?)\b/i,
    projects: /\b(projects?|portfolio)\b/i,
    skills: /\b(skills?|competencies|technologies)\b/i,
  }
  return (
    patterns.workExperience.test(titles.workExperience) &&
    patterns.education.test(titles.education) &&
    patterns.projects.test(titles.projects) &&
    patterns.skills.test(titles.skills)
  )
}

export function parseabilityPoints(text: string) {
  const length = text.trim().length
  if (length >= 200) {
    return { points: 10, detected: `${length} selectable characters were extracted from the PDF.` }
  }
  if (length >= 40) {
    return { points: 4, detected: `Only ${length} selectable characters were extracted from the PDF.` }
  }
  return { points: 0, detected: 'Little or no selectable text was extracted from the PDF.' }
}

function collectLinks(state: CVState) {
  const projectLinks = state.resume.projects.map((project) => project.link)
  return [state.resume.profile.website, state.resume.profile.github, state.resume.profile.linkedin, ...projectLinks]
}

function collectBullets(state: CVState) {
  return [
    ...state.resume.workExperience.flatMap((item) => item.bullets),
    ...state.resume.projects.flatMap((item) => item.bullets),
    ...state.resume.customSections.flatMap((item) => item.bullets),
  ]
}
