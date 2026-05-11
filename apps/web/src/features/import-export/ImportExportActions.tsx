'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { exportCVState } from './exportCVState'
import { importCVState } from './importCVState'

export function ImportExportActions() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { state, replaceState } = useCV()
  const [message, setMessage] = useState('')

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const nextState = await importCVState(file)
      if (window.confirm('Replace the current CV with this backup?')) {
        replaceState(nextState)
        setMessage('Backup restored.')
      }
    } catch {
      setMessage('Import failed. Choose a valid CVForge JSON backup.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="workbench-bar">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <p className="text-[10px] font-mono uppercase tracking-wider text-ink-4 sm:flex-1">
          JSON backups stay local.
        </p>
        <div className="flex gap-4">
          <ActionButton icon="export" label="Export" onClick={() => exportCVState(state)} />
          <ActionButton icon="import" label="Import" onClick={() => inputRef.current?.click()} />
        </div>
      </div>
      {message && <p className="mt-4 text-[11px] text-amber-200/60 italic">{message}</p>}
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
    </section>
  )
}

function ActionButton({ icon, label, onClick }: { icon: 'import' | 'export'; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn sm justify-center bg-bg/50 hover:bg-bg-3 shadow-sm hover:border-border-strong px-3 transition-all">
      <Icon name={icon} size={13} />
      <span className="font-medium">{label}</span>
    </button>
  )
}

