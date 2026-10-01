import { Document, Font, Page, View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { ResumePdfCustomSections } from './ResumePdfCustomSections'
import { ResumePdfEducationSection } from './ResumePdfEducationSection'
import { ResumePdfHeader } from './ResumePdfHeader'
import { ResumePdfLanguageSection } from './ResumePdfLanguageSection'
import { ResumePdfProjectSection } from './ResumePdfProjectSection'
import { hasPdfSkills, ResumePdfSkills } from './ResumePdfSkills'
import { ResumePdfWorkSection } from './ResumePdfWorkSection'
import { createResumePdfStyles } from './resumePdfStyles'
import { hyphenateForPdf } from './pdfHyphenation'

// Applies to the preview and the download, which both render this document.
Font.registerHyphenationCallback(hyphenateForPdf)

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

        <View style={styles.contentBounds}>
          {settings.sectionOrder.map((sectionId) => {
          const isVisible = settings.visibleSections[sectionId as keyof typeof settings.visibleSections]
          if (!isVisible) return null

          switch (sectionId) {
              case 'workExperience':
                return <ResumePdfWorkSection key={sectionId} state={state} styles={styles} />
              case 'projects':
                return <ResumePdfProjectSection key={sectionId} state={state} styles={styles} />
              case 'skills':
                return hasPdfSkills(resume.skills) ? <ResumePdfSkills key={sectionId} skills={resume.skills} styles={styles} title={settings.sectionTitles.skills} /> : null
              case 'education':
                return <ResumePdfEducationSection key={sectionId} state={state} styles={styles} />
              case 'languages':
                return <ResumePdfLanguageSection key={sectionId} state={state} styles={styles} />
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
