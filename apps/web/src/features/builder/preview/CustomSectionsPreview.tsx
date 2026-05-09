import { type CustomSection, type Settings } from '@/types/cv'
import { PreviewBulletList } from './PreviewBulletList'
import { PreviewSection } from './PreviewSection'

export function hasPreviewCustomSections(items: CustomSection[]) {
  return items.some((item) => item.title.trim() || item.bullets.some((bullet) => bullet.trim()))
}

export function CustomSectionsPreview({ items, settings }: { items: CustomSection[]; settings: Settings }) {
  const visibleItems = items.filter((item) => item.title.trim() || item.bullets.some((bullet) => bullet.trim()))

  return (
    <>
      {visibleItems.map((item) => (
        <PreviewSection key={item.id} title={item.title || 'Custom Section'} settings={settings} marginTop={settings.sectionSpacing}>
          <PreviewBulletList bullets={item.bullets} settings={settings} />
        </PreviewSection>
      ))}
    </>
  )
}
