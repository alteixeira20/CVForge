'use client'

import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { type Settings } from '@/types/cv'
import { SECTION_LABELS } from './settingsConstants'

export function SectionManager() {
  const { state, updateSettingsField } = useCV()
  const { sectionOrder, visibleSections, sectionTitles } = state.settings

  function toggleVisibility(id: string) {
    updateSettingsField('visibleSections', {
      ...visibleSections,
      [id]: !visibleSections[id as keyof typeof visibleSections],
    })
  }

  function moveSection(index: number, direction: 'up' | 'down') {
    const next = [...sectionOrder]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= next.length) return
    const [removed] = next.splice(index, 1)
    next.splice(target, 0, removed)
    updateSettingsField('sectionOrder', next)
  }

  function updateTitle(id: string, value: string) {
    updateSettingsField('sectionTitles', {
      ...sectionTitles,
      [id]: value,
    } as Settings['sectionTitles'])
  }

  return (
    <div className="py-2 space-y-0.5">
      {sectionOrder.map((id, index) => {
        const visible = visibleSections[id as keyof typeof visibleSections]
        const title = sectionTitles[id as keyof typeof sectionTitles] ?? ''
        const placeholder = SECTION_LABELS[id] ?? id

        return (
          <div key={id} className="flex items-center gap-1.5 py-0.5 rounded group">
            <button
              type="button"
              title={visible ? 'Hide section' : 'Show section'}
              aria-label={visible ? 'Hide section' : 'Show section'}
              onClick={() => toggleVisibility(id)}
              className={`w-5 h-5 flex items-center justify-center rounded border shrink-0 transition-colors ${
                visible
                  ? 'bg-ember/15 border-ember text-ember'
                  : 'bg-bg-2 border-border text-ink-4 hover:border-border-strong'
              }`}
            >
              <Icon name={visible ? 'eye' : 'eye-off'} size={11} />
            </button>

            <input
              type="text"
              value={title}
              placeholder={placeholder}
              onChange={(e) => updateTitle(id, e.target.value)}
              className="flex-1 min-w-0 bg-transparent border border-transparent rounded px-1.5 py-0.5 text-[11px] text-ink-2 placeholder:text-ink-4 focus:bg-bg-2 focus:border-border focus:text-ink outline-none transition-all"
            />

            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                type="button"
                title="Move up"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => moveSection(index, 'up')}
                className="w-5 h-5 flex items-center justify-center text-ink-4 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Icon name="arrow-up" size={11} />
              </button>
              <button
                type="button"
                title="Move down"
                aria-label="Move down"
                disabled={index === sectionOrder.length - 1}
                onClick={() => moveSection(index, 'down')}
                className="w-5 h-5 flex items-center justify-center text-ink-4 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Icon name="arrow-down" size={11} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
