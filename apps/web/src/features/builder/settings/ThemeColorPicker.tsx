'use client'

import { THEME_COLORS } from './settingsConstants'

interface ThemeColorPickerProps {
  value: string
  onChange: (value: string) => void
}

const VALID_HEX = /^#[0-9a-fA-F]{6}$/

export function ThemeColorPicker({ value, onChange }: ThemeColorPickerProps) {
  const normalised = value.toLowerCase()
  const colorForPicker = VALID_HEX.test(value) ? value : '#000000'

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-5 gap-1.5">
        {THEME_COLORS.map((color) => {
          const selected = normalised === color
          return (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => onChange(color)}
              aria-pressed={selected}
              className={`w-6 h-6 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 ${
                selected
                  ? 'ring-2 ring-ember scale-105 opacity-100'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 shrink-0 rounded-md border border-border overflow-hidden">
          <input
            type="color"
            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none bg-transparent"
            value={colorForPicker}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="flex-1 bg-bg-2 border border-border rounded-md px-2 py-1.5 text-xs text-ink font-mono uppercase focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-all focus-visible:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
