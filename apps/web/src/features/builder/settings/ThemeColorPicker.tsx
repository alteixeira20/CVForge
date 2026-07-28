'use client'

import { THEME_COLORS } from './settingsConstants'

interface ThemeColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ThemeColorPicker({ value, onChange }: ThemeColorPickerProps) {
  const normalised = value.toLowerCase()

  return (
    <div className="flex items-center gap-[3px]">
      {THEME_COLORS.map((color) => {
        const selected = normalised === color
        return (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onChange(color)}
            aria-pressed={selected}
            className={`w-4 h-4 shrink-0 rounded-[4px] transition-[border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 ${
              selected
                ? 'ring-2 ring-ember ring-offset-1 ring-offset-bg scale-105 opacity-100'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
          />
        )
      })}
      <input
        type="text"
        className="ml-1.5 min-w-[52px] flex-1 bg-bg-2 border border-border rounded-md px-1.5 py-0.5 text-[10px] text-ink font-mono uppercase focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-[border-color,box-shadow] focus-visible:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault()
            e.currentTarget.blur()
          }
        }}
        placeholder="#000000"
        maxLength={7}
        spellCheck={false}
      />
    </div>
  )
}
