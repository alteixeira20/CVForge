'use client'

import { type ReactNode } from 'react'

interface SettingsPanelProps {
  title: string
  children: ReactNode
}

export function SettingsPanel({ title, children }: SettingsPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-2/50 overflow-hidden">
      <div className="px-4 py-2 border-b border-border-faint/40">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-4">{title}</h4>
      </div>
      <div className="px-3 py-1">
        {children}
      </div>
    </div>
  )
}
