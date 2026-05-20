import { type CVState } from '@/types/cv'
import { isLikelyName, normalizeUrl } from './sectionDetection'

export function extractProfile(
  text: string,
  lines: string[],
  draft: CVState,
  detectedFields: string[],
  profileFields: string[],
) {
  const nameCandidate = lines.find((line) => isLikelyName(line))
  if (nameCandidate) addProfileField('Name', profileFields, detectedFields, () => { draft.resume.profile.name = nameCandidate })

  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
  if (email) addProfileField('Email', profileFields, detectedFields, () => { draft.resume.profile.email = email })

  const phone = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0]
  if (phone) addProfileField('Phone', profileFields, detectedFields, () => { draft.resume.profile.phone = phone })

  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (linkedin) addProfileField('LinkedIn', profileFields, detectedFields, () => { draft.resume.profile.linkedin = normalizeUrl(linkedin) })

  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (github) addProfileField('GitHub', profileFields, detectedFields, () => { draft.resume.profile.github = normalizeUrl(github) })

  const website = text.match(/https?:\/\/(?!.*(?:linkedin|github))[^\s)]+/i)?.[0]
  if (website) addProfileField('Website', profileFields, detectedFields, () => { draft.resume.profile.website = website })
}

function addProfileField(label: string, profileFields: string[], detectedFields: string[], apply: () => void) {
  apply()
  profileFields.push(label)
  detectedFields.push(label)
}
