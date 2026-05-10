import { type Education, type Settings } from '@/types/cv'
import { cleanList, cleanText, formatDateRange, joinNonEmpty } from '@/features/resume-formatting'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewEntryMeta, PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function EducationPreview({ items, settings }: { items: Education[]; settings: Settings }) {
  const visibleItems = items.filter((item) => hasEducationContent(item, settings.bulletVisibility.education))
  if (visibleItems.length === 0) return null

  return (
    <PreviewSection title="Education" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-12">
        {visibleItems.map((item) => <EducationPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function EducationPreviewItem({ item, settings }: { item: Education; settings: Settings }) {
  return (
    <div className="space-y-2">
      <PreviewEntryTop title={joinNonEmpty([item.degree, item.school], ', ')} dates={formatDateRange(item.startDate, item.endDate)} settings={settings} />
      <PreviewEntryMeta label={cleanText(item.location)} settings={settings} />
      <PreviewBulletList
        bullets={item.details}
        settings={settings}
        visible={settings.bulletVisibility.education}
      />
    </div>
  )
}

function hasEducationContent(item: Education, detailsVisible: boolean) {
  return Boolean(
    cleanText(item.school)
    || cleanText(item.degree)
    || cleanText(item.location)
    || formatDateRange(item.startDate, item.endDate)
    || (detailsVisible && cleanList(item.details).length > 0),
  )
}
