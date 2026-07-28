'use client'

import { type InputHTMLAttributes } from 'react'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onKeyDown'> {
  value: number
  onChange: (value: number) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
}

export function NumberInput({ value, onChange, onKeyDown, className = '', ...props }: NumberInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      e.currentTarget.blur()
    }
    onKeyDown?.(e)
  }

  return (
    <input
      type="number"
      className={`w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none focus-visible:outline-none transition-[border-color,box-shadow] ${className}`}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}
