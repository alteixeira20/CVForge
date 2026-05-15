'use client'

import { type ReactNode } from 'react'
import { FieldLabel } from './FieldLabel'

interface SettingRowProps {
  label: string
  children: ReactNode
  description?: string
  className?: string
}

export function SettingRow({ label, children, description, className = '' }: SettingRowProps) {
  return (
    <div className={`flex items-center gap-4 py-2.5 ${className}`}>
      <div className="flex-1 min-w-0">
        <FieldLabel className="mb-0 text-[11px]">{label}</FieldLabel>
        {description && <p className="text-[10px] text-ink-4 mt-0.5">{description}</p>}
      </div>
      <div className="w-[140px] shrink-0">
        {children}
      </div>
    </div>
  )
}
