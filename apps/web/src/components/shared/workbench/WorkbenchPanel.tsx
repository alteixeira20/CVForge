'use client'

import { type ReactNode } from 'react'

interface WorkbenchPanelProps {
  children: ReactNode
  className?: string
  scroll?: boolean
}

export function WorkbenchPanel({ children, className = '', scroll = true }: WorkbenchPanelProps) {
  return (
    <div className={`h-full ${scroll ? 'overflow-y-auto' : 'overflow-hidden'} ${className}`}>
      {children}
    </div>
  )
}
