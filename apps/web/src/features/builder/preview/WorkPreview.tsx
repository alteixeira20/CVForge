import { type Settings, type WorkExperience } from '@/types/cv'
import { cleanList, cleanText, formatDateRange, joinNonEmpty } from '@/features/resume-formatting'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewEntryMeta, PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function WorkPreview({ items, settings }: { items: WorkExperience[]; settings: Settings }) {
  const visibleItems = items.filter((item) => hasWorkContent(item, settings.bulletVisibility.workExperience))
  if (visibleItems.length === 0) return null

  return (
    <PreviewSection title="Work Experience" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-16">
        {visibleItems.map((item) => <WorkPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function WorkPreviewItem({ item, settings }: { item: WorkExperience; settings: Settings }) {
  const dates = formatDateRange(item.startDate, item.endDate, item.isCurrent)
  const title = joinNonEmpty([item.role, item.company], ' at ')

  return (
    <div className="space-y-4">
      <PreviewEntryTop title={title} dates={dates} settings={settings} />
      <PreviewEntryMeta label={cleanText(item.location)} settings={settings} italic />
      <PreviewBulletList
        bullets={item.bullets}
        settings={settings}
        visible={settings.bulletVisibility.workExperience}
      />
    </div>
  )
}

function hasWorkContent(item: WorkExperience, bulletsVisible: boolean) {
  return Boolean(
    cleanText(item.role)
    || cleanText(item.company)
    || cleanText(item.location)
    || formatDateRange(item.startDate, item.endDate, item.isCurrent)
    || (bulletsVisible && cleanList(item.bullets).length > 0),
  )
}
