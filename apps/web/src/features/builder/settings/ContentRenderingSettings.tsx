'use client'

import { useCV } from '@/context/CVContext'
import { type DescriptionMode } from '@/types/cv'

const CONTENT_SECTIONS = [
  { key: 'workExperience' as const, label: 'Work' },
  { key: 'education' as const, label: 'Education' },
  { key: 'projects' as const, label: 'Projects' },
  { key: 'customSections' as const, label: 'Custom' },
]

export function ContentRenderingSettings() {
  const { state, updateSettingsField } = useCV()
  const { descriptionMode, bulletVisibility } = state.settings

  function setMode(section: typeof CONTENT_SECTIONS[number]['key'], mode: DescriptionMode) {
    updateSettingsField('descriptionMode', { ...descriptionMode, [section]: mode })
  }

  function toggleBullets(section: typeof CONTENT_SECTIONS[number]['key']) {
    updateSettingsField('bulletVisibility', { ...bulletVisibility, [section]: !bulletVisibility[section] })
  }

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="flex-1 text-[9px] font-semibold uppercase tracking-wider text-ink-4">Section</span>
        <span className="w-[68px] shrink-0 text-center text-[9px] font-semibold uppercase tracking-wider text-ink-4">Format</span>
        <span className="w-8 shrink-0 text-center text-[9px] font-semibold uppercase tracking-wider text-ink-4">Bullets</span>
      </div>
      <div className="space-y-0.5">
        {CONTENT_SECTIONS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2 px-1 py-0.5">
            <span className="flex-1 text-[11px] text-ink-2">{label}</span>
            <div className="flex shrink-0 rounded overflow-hidden border border-border">
              <ModeButton
                active={descriptionMode[key] === 'bullets'}
                onClick={() => setMode(key, 'bullets')}
              >
                Bullets
              </ModeButton>
              <span className="w-px bg-border shrink-0" />
              <ModeButton
                active={descriptionMode[key] === 'paragraph'}
                onClick={() => setMode(key, 'paragraph')}
              >
                Para
              </ModeButton>
            </div>
            <div className="w-8 shrink-0 flex justify-center">
              <button
                type="button"
                onClick={() => toggleBullets(key)}
                aria-pressed={bulletVisibility[key]}
                title={bulletVisibility[key] ? 'Hide bullets in PDF' : 'Show bullets in PDF'}
                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center text-[8px] leading-none ${
                  bulletVisibility[key]
                    ? 'bg-ember/15 border-ember text-ember'
                    : 'bg-bg-2 border-border text-ink-4'
                }`}
              >
                {bulletVisibility[key] ? '✓' : ''}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-0.5 text-[10px] transition-colors cursor-pointer ${
        active ? 'bg-ember/15 text-ink' : 'bg-bg-2 text-ink-4 hover:text-ink-3'
      }`}
    >
      {children}
    </button>
  )
}
