'use client'

import { type ReactNode } from 'react'

interface WorkbenchActionGroupProps {
  children: ReactNode
  className?: string
}

/**
 * Compact horizontal group for workbench header or panel actions.
 */
export function WorkbenchActionGroup({ 
  children, 
  className = '' 
}: WorkbenchActionGroupProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  )
}
