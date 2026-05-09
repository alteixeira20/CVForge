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
  return collectLinks(state).some((link) => link && (text.includes(link) || link.includes('.')))
}

export function metricPoints(state: CVState) {
  return collectBullets(state).some((bullet) => /\d/.test(bullet)) ? 12 : 4
}

export function compactnessPoints(state: CVState, text: string) {
  const sourceLength = text.trim().length || JSON.stringify(state.resume).length
  if (sourceLength < 6000) return 8
  if (sourceLength < 9000) return 5
  return 2
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
