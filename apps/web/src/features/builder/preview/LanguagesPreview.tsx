import { type Language, type Settings } from '@/types/cv'
import { cleanText } from '@/features/resume-formatting'
import { PreviewSection } from './PreviewSection'

export function LanguagesPreview({ items, settings }: { items: Language[]; settings: Settings }) {
  const visibleItems = items.filter((item) => cleanText(item.name) || cleanText(item.proficiency))
  if (visibleItems.length === 0) return null

  return (
    <PreviewSection title="Languages" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-8 flex flex-wrap gap-x-24 gap-y-8">
        {visibleItems.map((item) => <LanguagePreviewItem key={item.id} item={item} settings={settings} />)}
      </div>
    </PreviewSection>
  )
}

function LanguagePreviewItem({ item, settings }: { item: Language; settings: Settings }) {
  const name = cleanText(item.name)
  const proficiency = cleanText(item.proficiency)

  return (
    <div className="flex gap-8 items-baseline">
      {name && <span className="font-bold text-gray-800" style={{ fontSize: settings.fontSize }}>{name}</span>}
      {proficiency && (
        <span className="text-gray-500 italic" style={{ fontSize: Math.max(8, settings.fontSize-2) }}>
          ({proficiency})
        </span>
      )}
    </div>
  )
}
