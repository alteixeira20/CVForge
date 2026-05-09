import { type ReactNode } from 'react'
import { type Settings } from '@/types/cv'

interface PreviewSectionProps {
  title: string
  settings: Settings
  marginTop: number
  children: ReactNode
}

export function PreviewSection({ title, settings, marginTop, children }: PreviewSectionProps) {
  return (
    <div style={{ marginTop }}>
      <h3
        className="font-bold border-b border-gray-200 pb-2 uppercase tracking-wider"
        style={{ fontSize: settings.sectionHeadingSize }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}
