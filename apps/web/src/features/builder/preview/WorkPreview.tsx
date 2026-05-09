import { type Settings, type WorkExperience } from '@/types/cv'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewEntryMeta, PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function WorkPreview({ items, settings }: { items: WorkExperience[]; settings: Settings }) {
  return (
    <PreviewSection title="Work Experience" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-16">
        {items.map((item) => <WorkPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function WorkPreviewItem({ item, settings }: { item: WorkExperience; settings: Settings }) {
  const dates = `${item.startDate} — ${item.isCurrent ? 'Present' : item.endDate}`

  return (
    <div className="space-y-4">
      <PreviewEntryTop title={item.company || 'Company'} dates={dates} settings={settings} />
      <PreviewEntryMeta label={item.role || 'Role'} value={item.location} settings={settings} italic />
      <PreviewBulletList
        bullets={item.bullets}
        settings={settings}
        visible={settings.bulletVisibility.workExperience}
      />
    </div>
  )
}
