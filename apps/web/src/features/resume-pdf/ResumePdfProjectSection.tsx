import { View } from '@react-pdf/renderer'
import { type CVState } from '@/types/cv'
import { cleanText, formatDateRange } from '@/lib/resume-formatting'
import { ResumePdfEntry } from './ResumePdfEntry'
import { ResumePdfSection } from './ResumePdfSection'
import { renderDescription } from './renderDescription'
import { hasProjectContent } from './resumePdfContentGuards'
import { type createResumePdfStyles } from './resumePdfStyles'

type Styles = ReturnType<typeof createResumePdfStyles>

export function ResumePdfProjectSection({ state, styles }: { state: CVState; styles: Styles }) {
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
