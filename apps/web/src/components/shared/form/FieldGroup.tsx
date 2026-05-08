'use client'

import { type ReactNode } from 'react'

interface FieldGroupProps {
  children: ReactNode
  columns?: 1 | 2
  className?: string
}

export function FieldGroup({ children, columns = 1, className = '' }: FieldGroupProps) {
  const gridClass = columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-16' : 'space-y-16'
  
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  )
}
