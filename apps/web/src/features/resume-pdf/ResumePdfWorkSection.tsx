import { View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { cleanText, formatDateRange, joinNonEmpty } from '@/lib/resume-formatting'
import { ResumePdfEntry } from './ResumePdfEntry'
import { ResumePdfSection } from './ResumePdfSection'
import { renderDescription } from './renderDescription'
import { hasWorkContent } from './resumePdfContentGuards'
import { type createResumePdfStyles } from './resumePdfStyles'

type Styles = ReturnType<typeof createResumePdfStyles>

export function ResumePdfWorkSection({ state, styles }: { state: CVState; styles: Styles }) {
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
