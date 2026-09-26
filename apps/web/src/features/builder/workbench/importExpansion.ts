import { useEffect, useState } from 'react'
import { type CVState } from '@/types/cv'

// After an import replaces the CV, the Builder opens every section that
// received content instead of leaving them collapsed.
const CV_IMPORTED_EVENT = 'cvforge:cv-imported'
let pendingSections: string[] | null = null

export function markCVImported(state: CVState) {
  pendingSections = sectionsWithContent(state)
  window.dispatchEvent(new Event(CV_IMPORTED_EVENT))
}

export function sectionsWithContent(state: CVState): string[] {
  const { profile, workExperience, education, projects, skills, languages, customSections } = state.resume
  const hasProfile = Object.values(profile).some((value) => typeof value === 'string' && value.trim() !== '')
  const hasSkills = [skills.featured, skills.featuredWithRating, skills.technical, skills.soft]
    .some((list) => list.length > 0)
  const candidates: Array<[string, boolean]> = [
    ['profile', hasProfile],
    ['experience', workExperience.length > 0],
    ['education', education.length > 0],
    ['projects', projects.length > 0],
    ['skills', hasSkills],
    ['custom', customSections.length > 0],
    ['languages', languages.length > 0],
  ]
  return candidates.filter(([, hasContent]) => hasContent).map(([id]) => id)
}

// Sections to open when the section list mounts, if an import just happened.
export function peekImportedSections() {
  return pendingSections
}

export function clearImportedSections() {
  pendingSections = null
}

// Changes after each import, so the section list can remount with the new
// open sections and freshly expanded entries.
export function useImportVersion() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const handleImport = () => setVersion((current) => current + 1)
    window.addEventListener(CV_IMPORTED_EVENT, handleImport)
    return () => window.removeEventListener(CV_IMPORTED_EVENT, handleImport)
  }, [])
  return version
}
