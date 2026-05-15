'use client'

import { type ReactNode } from 'react'

interface FieldLabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function FieldLabel({ children, htmlFor, required, className = '' }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-[11px] font-semibold text-ink-2 uppercase tracking-wider ${className}`}
    >
      {children}
      {required && <span className="text-ember ml-1">*</span>}
    </label>
  )
}
