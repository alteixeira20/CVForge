export const SITE_URL_ENV_VAR = 'NEXT_PUBLIC_SITE_URL'
export const DEVELOPMENT_SITE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://cvforge.alexandreteixeira.dev'

export const HOME_TITLE = 'CVForge — Local-First CV Builder & Analyzer'
export const HOME_DESCRIPTION =
  'Build, back up, export, and improve a CV or resume locally with a structured editor and transparent ATS-style PDF analysis.'
export const BUILDER_TITLE = 'Free CV Builder with PDF Export | CVForge'
export const BUILDER_DESCRIPTION =
  'Build a structured CV or resume for free with browser autosave, reliable JSON backup, live preview, and PDF export.'
export const ANALYZER_TITLE = 'ATS-Style CV Analyzer & Resume Checker | CVForge'
export const ANALYZER_DESCRIPTION =
  'Analyze a PDF locally for extraction quality, CV structure, completeness, clarity, impact, and prioritized improvement suggestions.'

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const siteConfig = {
  name: 'CVForge',
  applicationName: 'CVForge CV Builder and Analyzer',
  organizationName: 'Anvilary Labs',
  familyUrl: 'https://anvilary.tools',
  repositoryUrl: 'https://github.com/alteixeira20/CVForge',
  url: siteUrl,
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
} as const

export function absoluteSiteUrl(pathname = '/') {
  return new URL(pathname, `${siteUrl}/`).toString()
}

function resolveSiteUrl(configuredUrl: string | undefined) {
  if (!configuredUrl?.trim()) return DEVELOPMENT_SITE_URL

  const parsed = new URL(configuredUrl)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${SITE_URL_ENV_VAR} must use http:// or https://`)
  }
  return parsed.origin
}
