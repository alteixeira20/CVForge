import { type CVState } from '@/types/cv'

type SectionKey = keyof CVState['settings']['visibleSections']

export function normalizedVisibleText(state: CVState) {
  const { profile } = state.resume
  const values = [
    profile.name,
    profile.email,
    profile.phone,
    profile.location,
    profile.website,
    profile.github,
    profile.linkedin,
    profile.summary,
  ]

  for (const section of state.settings.sectionOrder) {
    if (!isSectionKey(section) || !state.settings.visibleSections[section]) continue
    values.push(...visibleSectionText(state, section))
  }

  return values
    .map((value) => value.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')
}

function visibleSectionText(state: CVState, section: SectionKey) {
  const title = state.settings.sectionTitles[section]
  const showBullets = section === 'skills' || section === 'languages'
    ? true
    : state.settings.bulletVisibility[section]

  if (section === 'workExperience') {
    return [
      title,
      ...state.resume.workExperience.flatMap((entry) => [
        entry.role,
        entry.company,
        entry.location,
        entry.startDate,
        entry.isCurrent ? 'Present' : entry.endDate,
        ...(showBullets ? entry.bullets : []),
      ]),
    ]
  }
  if (section === 'education') {
    return [
      title,
      ...state.resume.education.flatMap((entry) => [
        entry.degree,
        entry.school,
        entry.location,
        entry.startDate,
        entry.endDate,
        ...(showBullets ? entry.details : []),
      ]),
    ]
  }
  if (section === 'projects') {
    return [
      title,
      ...state.resume.projects.flatMap((entry) => [
        entry.name,
        entry.link,
        entry.startDate,
        entry.endDate,
        ...(showBullets ? entry.bullets : []),
      ]),
    ]
  }
  if (section === 'skills') {
    return [
      title,
      ...state.resume.skills.featured,
      ...state.resume.skills.featuredWithRating.map((skill) => skill.skill),
      ...state.resume.skills.technical,
      ...state.resume.skills.soft,
    ]
  }
  if (section === 'languages') {
    return [
      title,
      ...state.resume.languages.flatMap((language) => [language.name, language.proficiency]),
    ]
  }
  return [
    title,
    ...state.resume.customSections.flatMap((entry) => [
      entry.title,
      ...(showBullets ? entry.bullets : []),
    ]),
  ]
}

function isSectionKey(value: string): value is SectionKey {
  return [
    'workExperience',
    'education',
    'projects',
    'skills',
    'languages',
    'customSections',
  ].includes(value)
}
