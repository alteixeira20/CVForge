'use client'

import { type ReactNode } from 'react'

interface PreviewCanvasProps {
  children: ReactNode
  floatingActions?: ReactNode
  className?: string
}

/**
 * A shared canvas wrapper for document previews (PDF, text, etc.)
 * Provides the background, layout, and an optional floating action layer.
 */
export function PreviewCanvas({ 
  children, 
  floatingActions, 
  className = '' 
}: PreviewCanvasProps) {
  return (
    <div className={`relative h-full w-full flex flex-col overflow-hidden ${className}`}>
      <div className="h-full w-full flex-1 canvas">
        {children}
      </div>

      {floatingActions && (
        <div className="absolute left-6 bottom-6 z-20 flex items-center gap-2">
          {floatingActions}
        </div>
      )}
    </div>
  )
}
