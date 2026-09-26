import { type CVState } from '@/types/cv'
import { isContactLine, isLikelyLocation, isLikelyName, normalizeUrl, preambleLines } from './sectionDetection'

export function extractProfile(
  text: string,
  lines: string[],
  draft: CVState,
  detectedFields: string[],
  profileFields: string[],
) {
  const nameCandidate = lines.find((line) => isLikelyName(line))
  if (nameCandidate) addProfileField('Name', profileFields, detectedFields, () => { draft.resume.profile.name = nameCandidate })

  const email = text.match(EMAIL_PATTERN)?.[0]
  if (email) addProfileField('Email', profileFields, detectedFields, () => { draft.resume.profile.email = email })

  const phone = text.match(PHONE_PATTERN)?.[0]
  if (phone) addProfileField('Phone', profileFields, detectedFields, () => { draft.resume.profile.phone = phone })

  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (linkedin) addProfileField('LinkedIn', profileFields, detectedFields, () => { draft.resume.profile.linkedin = normalizeUrl(linkedin) })

  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/i)?.[0]
  if (github) addProfileField('GitHub', profileFields, detectedFields, () => { draft.resume.profile.github = normalizeUrl(github) })

  const website = text.match(/https?:\/\/(?!.*(?:linkedin|github))[^\s)]+/i)?.[0]
  if (website) addProfileField('Website', profileFields, detectedFields, () => { draft.resume.profile.website = website })

  const location = findHeaderLocation(preambleLines(text))
  if (location) addProfileField('Location', profileFields, detectedFields, () => { draft.resume.profile.location = location })
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
// Any run of digits, spaces, and phone punctuation long enough to be a number.
const PHONE_LIKE = /\+?\d[\d\s().-]{6,}\d/g
const URL_PATTERN = /(?:https?:\/\/|www\.)\S+|(?:linkedin|github)\.com\/\S+/gi
const CONTACT_SEPARATORS = /\s*[|\u2022\u00b7]\s*|\s{2,}/

// The location usually sits on the contact line ("email  phone  City, Country")
// or on its own line near the top. Only the header area is searched, so job
// locations further down are never used.
function findHeaderLocation(lines: string[]) {
  for (const line of lines.slice(0, 8)) {
    const residual = line
      .replace(new RegExp(EMAIL_PATTERN, 'g'), '  ')
      .replace(PHONE_LIKE, '  ')
      .replace(URL_PATTERN, '  ')
    const candidate = residual.split(CONTACT_SEPARATORS).map((part) => part.trim()).find(isLikelyLocation)
    if (candidate) return candidate
  }
  return ''
}

// An unheaded paragraph between the contact block and the first section is
// the summary in many templates, including CVForge's own PDF layout.
export function findUnheadedSummary(text: string, name: string) {
  const prose = preambleLines(text)
    .filter((line) => line !== name && !isContactLine(line) && !isLikelyLocation(line))
    .filter((line) => line.split(' ').length >= 6)
  const summary = prose.join(' ').trim()
  return summary.length >= 60 ? summary.slice(0, 1200) : ''
}

function addProfileField(label: string, profileFields: string[], detectedFields: string[], apply: () => void) {
  apply()
  profileFields.push(label)
  detectedFields.push(label)
}
