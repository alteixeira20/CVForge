import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { cleanText, formatDateRange, joinNonEmpty } from '@/lib/resume-formatting'
import { ResumePdfCustomSections } from './ResumePdfCustomSections'
import { ResumePdfEntry } from './ResumePdfEntry'
import { ResumePdfHeader } from './ResumePdfHeader'
import { ResumePdfSection } from './ResumePdfSection'
import { hasPdfSkills, ResumePdfSkills } from './ResumePdfSkills'
import { createResumePdfStyles } from './resumePdfStyles'
import { renderDescription } from './renderDescription'
import { hasEducationContent, hasProjectContent, hasWorkContent } from './resumePdfContentGuards'

type Styles = ReturnType<typeof createResumePdfStyles>

export function ResumePdfDocument({ state }: { state: CVState }) {
  const { resume, settings } = state
  const styles = createResumePdfStyles(settings)

  return (
    <Document
      title={resume.profile.name || 'CVForge Resume'}
      author={resume.profile.name}
      creator="CVForge"
      producer="CVForge (via @react-pdf/renderer)"
      subject={`CVForge Backup Candidate | Schema ${state.schemaVersion}`}
      keywords="cvforge,resume,cv"
    >
      <Page size={settings.documentSize === 'Letter' ? 'LETTER' : 'A4'} style={styles.page}>
        <ResumePdfHeader profile={resume.profile} settings={settings} styles={styles} />

        <View>
          {settings.sectionOrder.map((sectionId) => {
            const isVisible = settings.visibleSections[sectionId as keyof typeof settings.visibleSections]
            if (!isVisible) return null

            switch (sectionId) {
              case 'workExperience':
                return <WorkSection key={sectionId} state={state} styles={styles} />
              case 'projects':
                return <ProjectSection key={sectionId} state={state} styles={styles} />
              case 'skills':
                return hasPdfSkills(resume.skills) ? <ResumePdfSkills key={sectionId} skills={resume.skills} styles={styles} title={settings.sectionTitles.skills} /> : null
              case 'education':
                return <EducationSection key={sectionId} state={state} styles={styles} />
              case 'languages':
                return <LanguageSection key={sectionId} state={state} styles={styles} />
              case 'customSections':
                return <ResumePdfCustomSections key={sectionId} items={resume.customSections} styles={styles} settings={settings} />
              default:
                return null
            }
          })}
        </View>
      </Page>
    </Document>
  )
}

function WorkSection({ state, styles }: { state: CVState; styles: Styles }) {
  const { settings } = state
  const items = state.resume.workExperience.filter((item) => hasWorkContent(item, settings.bulletVisibility.workExperience))
  if (items.length === 0) return null
  return (
    <ResumePdfSection title={settings.sectionTitles.workExperience} styles={styles}>
      {items.map((item, index) => (
        <View key={item.id} style={index === items.length - 1 ? undefined : styles.workEntryGroup}>
          <ResumePdfEntry
            title={cleanText(item.role)}
            organization={cleanText(item.company)}
            subtitle={joinNonEmpty([item.location])}
            dates={formatDateRange(item.startDate, item.endDate, item.isCurrent)}
            styles={styles}
          />
          {renderDescription(item.bullets, settings.descriptionMode.workExperience, settings.bulletVisibility.workExperience, styles)}
        </View>
      ))}
    </ResumePdfSection>
  )
}

function ProjectSection({ state, styles }: { state: CVState; styles: Styles }) {
  const { settings } = state
  const items = state.resume.projects.filter((item) => hasProjectContent(item, settings.bulletVisibility.projects))
  if (items.length === 0) return null
  return (
    <ResumePdfSection title={settings.sectionTitles.projects} styles={styles}>
      {items.map((item, index) => (
        <View key={item.id} style={index === items.length - 1 ? undefined : styles.projectEntryGroup}>
          <ResumePdfEntry
            title={cleanText(item.name)}
            subtitle={cleanText(item.link)}
            dates={formatDateRange(item.startDate, item.endDate)}
            styles={styles}
          />
          {renderDescription(item.bullets, settings.descriptionMode.projects, settings.bulletVisibility.projects, styles)}
        </View>
      ))}
    </ResumePdfSection>
  )
}

function EducationSection({ state, styles }: { state: CVState; styles: Styles }) {
  const { settings } = state
  const items = state.resume.education.filter((item) => hasEducationContent(item, settings.bulletVisibility.education))
  if (items.length === 0) return null
  return (
    <ResumePdfSection title={settings.sectionTitles.education} styles={styles}>
      {items.map((item, index) => (
        <View key={item.id} style={index === items.length - 1 ? undefined : styles.educationEntryGroup}>
          <ResumePdfEntry
            title={cleanText(item.degree)}
            organization={cleanText(item.school)}
            subtitle={cleanText(item.location)}
            dates={formatDateRange(item.startDate, item.endDate)}
            styles={styles}
          />
          {renderDescription(item.details, settings.descriptionMode.education, settings.bulletVisibility.education, styles)}
        </View>
      ))}
    </ResumePdfSection>
  )
}

function LanguageSection({ state, styles }: { state: CVState; styles: Styles }) {
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
