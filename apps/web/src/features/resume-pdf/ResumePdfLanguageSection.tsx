import React from 'react'
import { Text } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { cleanText } from '@/lib/resume-formatting'
import { ResumePdfSection } from './ResumePdfSection'
import { type createResumePdfStyles } from './resumePdfStyles'

type Styles = ReturnType<typeof createResumePdfStyles>

export function ResumePdfLanguageSection({ state, styles }: { state: CVState; styles: Styles }) {
  const { settings } = state
  const languages = state.resume.languages.filter((item) => cleanText(item.name))
  if (languages.length === 0) return null
  return (
    <ResumePdfSection title={settings.sectionTitles.languages} styles={styles}>
      <Text style={styles.languageText}>
        {languages.flatMap((lang, i) => {
          const name = cleanText(lang.name)
          const prof = cleanText(lang.proficiency)
          const parts: React.ReactNode[] = []
          if (i > 0) parts.push(' · ')
          parts.push(name)
          if (prof) parts.push(<Text key={`prof-${lang.id}`} style={styles.languageProf}> ({prof})</Text>)
          return parts
        })}
      </Text>
    </ResumePdfSection>
  )
}
