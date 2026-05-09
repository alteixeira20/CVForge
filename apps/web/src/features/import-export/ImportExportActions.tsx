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
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-16">
      <ImportExportHeader />
      <div className="flex flex-col sm:flex-row gap-12">
        <ActionButton icon="export" label="Export JSON" onClick={() => exportCVState(state)} />
        <ActionButton icon="import" label="Restore JSON" onClick={() => inputRef.current?.click()} />
      </div>
      {message && <p className="text-xs text-ink-3">{message}</p>}
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
    </section>
  )
}

function ImportExportHeader() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">Reliable Backup & Restore</h2>
      <p className="text-xs text-ink-3 mt-4">
        JSON is the guaranteed way to save or restore your full CVForge session. 
        Everything stays local in your browser.
      </p>
    </div>
  )
}

function ActionButton({ icon, label, onClick }: { icon: 'import' | 'export'; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn flex-1 justify-center">
      <Icon name={icon} size={14} />
      {label}
    </button>
  )
}
