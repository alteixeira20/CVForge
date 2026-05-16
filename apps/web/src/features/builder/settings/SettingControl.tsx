'use client'

import { type ReactNode } from 'react'

interface SettingControlProps {
  label: string
  unit?: string
  children: ReactNode
}

export function SettingControl({ label, unit, children }: SettingControlProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-2 leading-none">
          {label}
        </span>
        {unit && <span className="text-[9px] text-ink-4 leading-none">{unit}</span>}
      </div>
      <div className="[&_input]:w-full [&_input]:py-1 [&_input]:px-2 [&_input]:text-[11px] [&_input]:rounded-md [&_select]:w-full [&_select]:py-1 [&_select]:px-2 [&_select]:text-[11px] [&_select]:rounded-md">
        {children}
      </div>
    </div>
  )
}
