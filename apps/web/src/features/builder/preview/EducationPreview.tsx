import { type Education, type Settings } from '@/types/cv'
import { PreviewEntryMeta, PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function EducationPreview({ items, settings }: { items: Education[]; settings: Settings }) {
  return (
    <PreviewSection title="Education" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-12">
        {items.map((item) => <EducationPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function EducationPreviewItem({ item, settings }: { item: Education; settings: Settings }) {
  return (
    <div className="space-y-2">
      <PreviewEntryTop title={item.school || 'Institution'} dates={`${item.startDate} — ${item.endDate}`} settings={settings} />
      <PreviewEntryMeta label={item.degree || 'Degree'} value={item.location} settings={settings} />
    </div>
  )
}
