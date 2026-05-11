'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { type CVState } from '@/types/cv'

export function ParserRestoreAction({ embeddedState }: { embeddedState: CVState }) {
  const { replaceState } = useCV()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleRestore = () => {
    if (window.confirm('Replace the current CV with the session found in this PDF?')) {
      replaceState(embeddedState)
      alert('Session restored.')
    }
  }

  return (
    <WorkbenchSectionCard
      title="CVForge Session Found"
      icon="check"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status="Ready to restore"
      className="border-ember/40 bg-ember/5"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
        <p className="text-xs text-ink-3 leading-relaxed max-w-sm">
          This PDF includes a session attachment. You can perfectly restore it to the builder with no data loss.
        </p>
        
        <button
          type="button"
          onClick={handleRestore}
          className="btn primary whitespace-nowrap h-9 px-4 text-xs shadow-ember"
        >
          Restore Session
        </button>
      </div>
    </WorkbenchSectionCard>
  )
}
