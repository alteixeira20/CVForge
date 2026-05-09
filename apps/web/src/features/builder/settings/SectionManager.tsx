'use client'

import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'

const SECTION_LABELS: Record<string, string> = {
  workExperience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  customSections: 'Custom Sections',
}

export function SectionManager() {
  const { state, updateSettingsField } = useCV()
  const { sectionOrder, visibleSections } = state.settings

  const toggleVisibility = (id: string) => {
    updateSettingsField('visibleSections', {
      ...visibleSections,
      [id]: !visibleSections[id as keyof typeof visibleSections],
    })
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextOrder = [...sectionOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= nextOrder.length) return

    const [removed] = nextOrder.splice(index, 1)
    nextOrder.splice(targetIndex, 0, removed)
    updateSettingsField('sectionOrder', nextOrder)
  }

  return (
    <div className="space-y-4">
      {sectionOrder.map((id, index) => (
        <div key={id} className="flex items-center gap-12 p-8 bg-bg-3 border border-border rounded-lg group">
          <button
            type="button"
            title={visibleSections[id as keyof typeof visibleSections] ? 'Hide section' : 'Show section'}
            aria-label={visibleSections[id as keyof typeof visibleSections] ? 'Hide section' : 'Show section'}
            onClick={() => toggleVisibility(id)}
            className={`w-32 h-32 flex items-center justify-center rounded border transition-colors ${
              visibleSections[id as keyof typeof visibleSections]
                ? 'bg-ember border-ember text-white'
                : 'bg-bg-2 border-border text-ink-4'
            }`}
          >
            <Icon name={visibleSections[id as keyof typeof visibleSections] ? 'eye' : 'eye-off'} size={14} />
          </button>

          <span className="flex-1 text-xs font-medium text-ink">
            {SECTION_LABELS[id] || id}
          </span>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              title="Move section up"
              aria-label="Move section up"
              disabled={index === 0}
              onClick={() => moveSection(index, 'up')}
              className="w-24 h-24 flex items-center justify-center text-ink-4 hover:text-ink disabled:opacity-20"
            >
              <Icon name="arrow-up" size={14} />
            </button>
            <button
              type="button"
              title="Move section down"
              aria-label="Move section down"
              disabled={index === sectionOrder.length - 1}
              onClick={() => moveSection(index, 'down')}
              className="w-24 h-24 flex items-center justify-center text-ink-4 hover:text-ink disabled:opacity-20"
            >
              <Icon name="arrow-down" size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
