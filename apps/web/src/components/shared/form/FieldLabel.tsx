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
      className={`block text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-6 ${className}`}
    >
      {children}
      {required && <span className="text-ember ml-4">*</span>}
    </label>
  )
}
