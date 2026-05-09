import { type Project, type Settings } from '@/types/cv'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function ProjectsPreview({ items, settings }: { items: Project[]; settings: Settings }) {
  return (
    <PreviewSection title="Projects" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-16">
        {items.map((item) => <ProjectPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function ProjectPreviewItem({ item, settings }: { item: Project; settings: Settings }) {
  return (
    <div className="space-y-4">
      <PreviewEntryTop title={item.name || 'Project Name'} dates={`${item.startDate} — ${item.endDate}`} settings={settings} />
      {item.link && <div className="text-ember underline" style={{ fontSize: Math.max(8, settings.fontSize - 2) }}>{item.link}</div>}
      <PreviewBulletList
        bullets={item.bullets}
        settings={settings}
        visible={settings.bulletVisibility.projects}
      />
    </div>
  )
}
