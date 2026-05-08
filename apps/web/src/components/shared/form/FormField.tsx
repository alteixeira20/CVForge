'use client'

import { type ReactNode } from 'react'
import { FieldLabel } from './FieldLabel'

interface FormFieldProps {
  label: string
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function FormField({ label, children, htmlFor, required, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      {children}
    </div>
  )
}
