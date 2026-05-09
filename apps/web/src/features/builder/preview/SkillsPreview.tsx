import { type Settings, type Skills } from '@/types/cv'
import { PreviewSection } from './PreviewSection'

export function hasPreviewSkills(skills: Skills) {
  return skills.featured.length > 0
    || skills.featuredWithRating.some((item) => item.skill.trim())
    || skills.technical.length > 0
    || skills.soft.length > 0
}

export function SkillsPreview({ skills, settings }: { skills: Skills; settings: Settings }) {
  return (
    <PreviewSection title="Skills" settings={settings} marginTop={settings.sectionSpacing}>
      <div className="mt-8 space-y-8">
        {(skills.featured.length > 0 || skills.featuredWithRating.length > 0) && (
          <FeaturedSkills skills={skills} settings={settings} />
        )}
        {skills.technical.length > 0 && <SkillLine label="Technical" items={skills.technical} settings={settings} />}
        {skills.soft.length > 0 && <SkillLine label="Soft" items={skills.soft} settings={settings} />}
      </div>
    </PreviewSection>
  )
}

function FeaturedSkills({ skills, settings }: { skills: Skills; settings: Settings }) {
  const ratedItems = skills.featuredWithRating.filter((item) => item.skill.trim())
  const simpleItems = skills.featured.filter((item) => item.trim())

  if (ratedItems.length === 0 && simpleItems.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-16 gap-y-4">
      {simpleItems.map((item, index) => (
        <span key={`${item}-${index}`} className="text-gray-700" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>
          {item}
        </span>
      ))}
      {ratedItems.map((item, index) => (
        <span key={`${item.skill}-${index}`} className="text-gray-700" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>
          {item.skill}{typeof item.rating === 'number' ? ` (${item.rating}/5)` : ''}
        </span>
      ))}
    </div>
  )
}

function SkillLine({ label, items, settings }: { label: string; items: string[]; settings: Settings }) {
  const visibleItems = items.filter((item) => item.trim())

  if (visibleItems.length === 0) return null

  return (
    <p className="text-gray-700" style={{ fontSize: Math.max(8, settings.fontSize - 1), lineHeight: settings.lineHeight }}>
      <span className="font-bold text-gray-800">{label}: </span>
      {visibleItems.join(', ')}
    </p>
  )
}
