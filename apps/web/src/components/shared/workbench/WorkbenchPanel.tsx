'use client'

import { type ReactNode } from 'react'

interface WorkbenchPanelProps {
  children: ReactNode
  className?: string
}

export function WorkbenchPanel({ children, className = '' }: WorkbenchPanelProps) {
  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}
