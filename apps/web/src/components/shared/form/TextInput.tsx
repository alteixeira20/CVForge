'use client'

import { type InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function TextInput({ className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-all ${className}`}
      {...props}
    />
  )
}
