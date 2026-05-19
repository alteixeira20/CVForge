'use client'

import { FONT_FAMILY_GROUPS } from './settingsConstants'

interface FontFamilyPickerProps {
  value: string
  onChange: (value: string) => void
}

export function FontFamilyPicker({ value, onChange }: FontFamilyPickerProps) {
  return (
    <div className="space-y-1.5">
      {FONT_FAMILY_GROUPS.map(({ category, fonts }) => (
        <div key={category} className="flex items-center gap-2">
          <span className="w-7 shrink-0 text-[9px] text-ink-4 uppercase tracking-wider">{category}</span>
          <div className="flex gap-1">
            {fonts.map((font) => {
              const selected = value === font.value
              return (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => onChange(font.value)}
                  aria-pressed={selected}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                    selected
                      ? 'bg-ember/15 border-ember text-ink'
                      : 'bg-bg-2 border-border text-ink-3 hover:border-border-strong hover:text-ink-2'
                  }`}
                >
                  {font.display}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
