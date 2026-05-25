import { View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { cleanText, formatDateRange } from '@/lib/resume-formatting'
import { ResumePdfEntry } from './ResumePdfEntry'
import { ResumePdfSection } from './ResumePdfSection'
import { renderDescription } from './renderDescription'
import { hasEducationContent } from './resumePdfContentGuards'
import { type createResumePdfStyles } from './resumePdfStyles'

type Styles = ReturnType<typeof createResumePdfStyles>

export function ResumePdfEducationSection({ state, styles }: { state: CVState; styles: Styles }) {
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
