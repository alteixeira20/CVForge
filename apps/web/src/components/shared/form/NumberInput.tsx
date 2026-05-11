'use client'

import { type InputHTMLAttributes } from 'react'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function NumberInput({ value, onChange, className = '', ...props }: NumberInputProps) {
  return (
    <input
      type="number"
      className={`w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-all ${className}`}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...props}
    />
  )
}
