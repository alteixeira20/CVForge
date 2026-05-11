'use client'

import { type InputHTMLAttributes } from 'react'

interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorInput({ value, onChange, className = '', ...props }: ColorInputProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 shrink-0 rounded-md border border-border overflow-hidden bg-bg-3 shadow-sm">
        <input
          type="color"
          className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>
      <input
        type="text"
        className="flex-1 bg-bg-2 border border-border rounded-md px-2 py-1.5 text-xs text-ink font-mono uppercase focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
