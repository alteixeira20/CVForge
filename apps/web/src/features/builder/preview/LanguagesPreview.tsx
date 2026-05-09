import { type Language, type Settings } from '@/types/cv'
import { PreviewSection } from './PreviewSection'

export function LanguagesPreview({ items, settings }: { items: Language[]; settings: Settings }) {
  return (
    <PreviewSection title="Languages" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-8 flex flex-wrap gap-x-24 gap-y-8">
        {items.map((item) => <LanguagePreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function LanguagePreviewItem({ item, settings }: { item: Language; settings: Settings }) {
  return (
    <div className="flex gap-8 items-baseline">
      <span className="font-bold text-gray-800" style={{ fontSize: settings.fontSize }}>{item.name}</span>
      <span className="text-gray-500 italic" style={{ fontSize: Math.max(8, settings.fontSize - 2) }}>
        ({item.proficiency})
      </span>
    </div>
  )
}
