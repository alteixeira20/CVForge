import { type CustomSection, type Settings } from '@/types/cv'
import { cleanList, cleanText } from '@/features/resume-formatting'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewSection } from './PreviewSection'

export function hasPreviewCustomSections(items: CustomSection[]) {
  return items.some((item) => cleanText(item.title) && cleanList(item.bullets).length > 0)
}

export function CustomSectionsPreview({ items, settings }: { items: CustomSection[]; settings: Settings }) {
  const visibleItems = items.filter((item) => hasCustomSectionContent(item, settings.bulletVisibility.customSections))
  if (visibleItems.length === 0) return null

  return (
    <div className="flex flex-col">
      {visibleItems.map((item) => (
        <PreviewSection key={item.id} title={cleanText(item.title)} settings={settings} marginTop={settings.sectionSpacing}>
          <PreviewBulletList
            bullets={item.bullets}
            settings={settings}
            visible={settings.bulletVisibility.customSections}
          />
        </PreviewSection>
      ))}
    </div>
  )
}

function hasCustomSectionContent(item: CustomSection, bulletsVisible: boolean) {
  return Boolean(cleanText(item.title) && bulletsVisible && cleanList(item.bullets).length > 0)
}
