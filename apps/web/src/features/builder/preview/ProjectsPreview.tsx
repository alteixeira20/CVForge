import { type Project, type Settings } from '@/types/cv'
import { cleanList, cleanText, formatDateRange } from '@/features/resume-formatting'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewEntryTop } from './PreviewEntry'
import { PreviewSection } from './PreviewSection'

export function ProjectsPreview({ items, settings }: { items: Project[]; settings: Settings }) {
  const visibleItems = items.filter((item) => hasProjectContent(item, settings.bulletVisibility.projects))
  if (visibleItems.length === 0) return null

  return (
    <PreviewSection title="Projects" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-12 space-y-16">
        {visibleItems.map((item) => <ProjectPreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function ProjectPreviewItem({ item, settings }: { item: Project; settings: Settings }) {
  const link = cleanText(item.link)

  return (
    <div className="space-y-4">
      <PreviewEntryTop title={cleanText(item.name)} dates={formatDateRange(item.startDate, item.endDate)} settings={settings} />
      {link && <div className="text-ember underline" style={{ fontSize: Math.max(8, settings.fontSize-2) }}>{link}</div>}
      <PreviewBulletList
        bullets={item.bullets}
        settings={settings}
        visible={settings.bulletVisibility.projects}
      />
    </div>
  )
}

function hasProjectContent(item: Project, bulletsVisible: boolean) {
  return Boolean(
    cleanText(item.name)
    || cleanText(item.link)
    || formatDateRange(item.startDate, item.endDate)
    || (bulletsVisible && cleanList(item.bullets).length > 0),
  )
}
