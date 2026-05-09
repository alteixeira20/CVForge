'use client'

import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { type CVState } from '@/types/cv'

export function ParserRestoreAction({ embeddedState }: { embeddedState: CVState }) {
  const { replaceState } = useCV()

  const handleRestore = () => {
    if (window.confirm('Replace the current CV with the session found in this PDF?')) {
      replaceState(embeddedState)
      alert('Session restored.')
    }
  }

  return (
    <div className="panel p-20 bg-ember/10 border border-ember rounded-xl flex items-center justify-between gap-16">
      <div className="space-y-4">
        <div className="flex items-center gap-8 text-ember font-semibold">
          <Icon name="check" size={16} />
          <span className="text-sm">CVForge Session Found</span>
        </div>
        <p className="text-xs text-ink-3">
          This PDF includes a session attachment. You can perfectly restore it to the builder.
        </p>
      </div>
      
      <button
        type="button"
        onClick={handleRestore}
        className="btn whitespace-nowrap"
        style={{ backgroundColor: 'var(--ember)', color: 'white' }}
      >
        Restore Session
      </button>
    </div>
  )
}
