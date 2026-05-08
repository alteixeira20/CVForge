'use client'

import { type ReactNode } from 'react'

interface SectionCardProps {
  children: ReactNode
  className?: string
}

export function SectionCard({ children, className = '' }: SectionCardProps) {
  return (
    <div className={`panel p-24 bg-bg-2 border border-border rounded-xl ${className}`}>
      {children}
    </div>
  )
}
