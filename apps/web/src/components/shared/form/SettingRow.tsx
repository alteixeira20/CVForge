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
    <div className={`flex items-center gap-3 py-1.5 ${className}`}>
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <FieldLabel className="mb-0 text-[11px]">{label}</FieldLabel>
        {description && <span className="text-[10px] text-ink-4">{description}</span>}
      </div>
      <div className="w-[120px] shrink-0 [&_input]:py-1 [&_input]:text-[11px] [&_input]:px-2 [&_select]:py-1 [&_select]:text-[11px] [&_select]:px-2">
        {children}
      </div>
    </div>
  )
}
