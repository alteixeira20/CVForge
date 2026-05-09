import { Document, Page, Text, View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { ResumePdfCustomSections } from './ResumePdfCustomSections'
import { ResumePdfEntry } from './ResumePdfEntry'
import { ResumePdfHeader } from './ResumePdfHeader'
import { ResumePdfBullets, ResumePdfSection } from './ResumePdfSection'
import { hasPdfSkills, ResumePdfSkills } from './ResumePdfSkills'
import { createResumePdfStyles } from './resumePdfStyles'

export function ResumePdfDocument({ state }: { state: CVState }) {
  const { resume, settings } = state
  const styles = createResumePdfStyles(settings)

  return (
    <Document title={resume.profile.name || 'CVForge Resume'}>
      <Page size={settings.documentSize === 'Letter' ? 'LETTER' : 'A4'} style={styles.page}>
        <ResumePdfHeader profile={resume.profile} settings={settings} styles={styles} />
        <WorkSection state={state} styles={styles} />
        <ProjectSection state={state} styles={styles} />
        {hasPdfSkills(resume.skills) && <ResumePdfSkills skills={resume.skills} styles={styles} />}
        <EducationSection state={state} styles={styles} />
        <LanguageSection state={state} styles={styles} />
        <ResumePdfCustomSections items={resume.customSections} styles={styles} />
      </Page>
    </Document>
  )
}

function WorkSection({ state, styles }: { state: CVState; styles: ReturnType<typeof createResumePdfStyles> }) {
  if (state.resume.workExperience.length === 0) return null
  return (
    <ResumePdfSection title="Experience" styles={styles}>
      {state.resume.workExperience.map((item) => (
        <View key={item.id}>
          <ResumePdfEntry title={item.role || 'Role'} subtitle={item.company} dates={`${item.startDate} - ${item.endDate}`} styles={styles} />
          <ResumePdfBullets bullets={item.bullets} styles={styles} />
        </View>
      ))}
    </ResumePdfSection>
  )
}

function ProjectSection({ state, styles }: { state: CVState; styles: ReturnType<typeof createResumePdfStyles> }) {
  if (state.resume.projects.length === 0) return null
  return (
    <ResumePdfSection title="Projects" styles={styles}>
      {state.resume.projects.map((item) => (
        <View key={item.id}>
          <ResumePdfEntry title={item.name || 'Project'} subtitle={item.link} dates={`${item.startDate} - ${item.endDate}`} styles={styles} />
          <ResumePdfBullets bullets={item.bullets} styles={styles} />
        </View>
      ))}
    </ResumePdfSection>
  )
}

function EducationSection({ state, styles }: { state: CVState; styles: ReturnType<typeof createResumePdfStyles> }) {
  if (state.resume.education.length === 0) return null
  return (
    <ResumePdfSection title="Education" styles={styles}>
      {state.resume.education.map((item) => (
        <View key={item.id}>
          <ResumePdfEntry title={item.degree || 'Degree'} subtitle={item.school} dates={`${item.startDate} - ${item.endDate}`} styles={styles} />
          <ResumePdfBullets bullets={item.details} styles={styles} />
        </View>
      ))}
    </ResumePdfSection>
  )
}

function LanguageSection({ state, styles }: { state: CVState; styles: ReturnType<typeof createResumePdfStyles> }) {
  if (state.resume.languages.length === 0) return null
  return (
    <ResumePdfSection title="Languages" styles={styles}>
      <Text>{state.resume.languages.map((item) => `${item.name}${item.proficiency ? ` (${item.proficiency})` : ''}`).join(', ')}</Text>
    </ResumePdfSection>
  )
}
