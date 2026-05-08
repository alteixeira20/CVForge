'use client'

import { type InputHTMLAttributes } from 'react'

interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorInput({ value, onChange, className = '', ...props }: ColorInputProps) {
  return (
    <div className={`flex items-center gap-8 ${className}`}>
      <input
        type="color"
        className="w-32 h-32 rounded cursor-pointer border-none bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <input
        type="text"
        className="flex-1 bg-bg-2 border border-border rounded px-8 py-4 text-xs text-ink mono uppercase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
