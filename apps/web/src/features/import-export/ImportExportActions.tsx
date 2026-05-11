'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { WorkbenchActionGroup } from '@/components/shared/workbench/WorkbenchActionGroup'
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
      if (event.target) event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <WorkbenchActionGroup>
        <ActionButton icon="export" label="Export" onClick={() => exportCVState(state)} />
        <ActionButton icon="import" label="Import" onClick={() => inputRef.current?.click()} />
      </WorkbenchActionGroup>
      {message && <p className="text-[10px] text-amber-200/60 italic text-right whitespace-nowrap">{message}</p>}
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
    </div>
  )
}

function ActionButton({ icon, label, onClick }: { icon: 'import' | 'export'; label: string; onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="btn sm bg-bg-3 border-border-strong hover:bg-bg-2 hover:border-border transition-all px-2 h-8"
      title={label}
    >
      <Icon name={icon} size={13} />
      <span className="text-xs font-medium hidden sm:inline">{label}</span>
    </button>
  )
}
