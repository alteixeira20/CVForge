'use client'

import { resolvePdfFont } from '@/features/resume-pdf/resumePdfFontHelpers'
import { FONT_FAMILY_OPTIONS } from './settingsConstants'

interface FontFamilyPickerProps {
  value: string
  onChange: (value: string) => void
}

// Older saved CVs may store names such as Lexend or Georgia. They are shown
// as the PDF family they actually produce.
export function FontFamilyPicker({ value, onChange }: FontFamilyPickerProps) {
  const selectedPdfFont = resolvePdfFont(value)

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {FONT_FAMILY_OPTIONS.map((font) => {
          const selected = resolvePdfFont(font.value) === selectedPdfFont
          return (
            <button
              key={font.value}
              type="button"
              onClick={() => onChange(font.value)}
              aria-pressed={selected}
              aria-label={`${font.display} (${font.category})`}
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
      <p className="text-[10px] leading-relaxed text-ink-4">
        Standard PDF fonts that every PDF reader displays the same way.
      </p>
    </div>
  )
}
