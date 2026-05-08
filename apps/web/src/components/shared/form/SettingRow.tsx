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
    <div className={`flex items-center justify-between gap-16 py-8 ${className}`}>
      <div className="flex-1">
        <FieldLabel className="mb-0 text-[10px]">{label}</FieldLabel>
        {description && <p className="text-[10px] text-ink-4 mt-2">{description}</p>}
      </div>
      <div className="w-1/2 max-w-[120px]">
        {children}
      </div>
    </div>
  )
}
