import React from 'react'
import { Text, View } from '@react-pdf/renderer'
import { type CVState, type Language } from '@/types/cv'
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
      {settings.languageLayout === 'rows'
        ? (
          <View style={styles.languageList}>
            {languages.map((language) => (
              <Text key={language.id} style={styles.languageText}>
                <LanguageLabel language={language} styles={styles} />
              </Text>
            ))}
          </View>
        )
        : (
          <Text style={styles.languageText}>
            {languages.flatMap((language, index) => {
              const parts: React.ReactNode[] = []
              if (index > 0) parts.push(' · ')
              parts.push(<LanguageLabel key={language.id} language={language} styles={styles} />)
              return parts
            })}
          </Text>
        )}
    </ResumePdfSection>
  )
}

function LanguageLabel({ language, styles }: { language: Language; styles: Styles }) {
  const name = cleanText(language.name)
  const proficiency = cleanText(language.proficiency)

  return (
    <>
      {name}
      {proficiency
        ? <Text style={styles.languageProf}> ({proficiency})</Text>
        : null}
    </>
  )
}
