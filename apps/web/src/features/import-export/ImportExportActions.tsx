'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { WorkbenchActionGroup } from '@/components/shared/workbench/WorkbenchActionGroup'
import { exportCVState } from './exportCVState'
import { ImportModal } from './ImportModal'

export function ImportExportActions() {
  const { state } = useCV()
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        <WorkbenchActionGroup>
          <ActionButton icon="export" label="Export" onClick={() => exportCVState(state)} />
          <ActionButton icon="import" label="Import" onClick={() => setIsImportModalOpen(true)} />
        </WorkbenchActionGroup>
      </div>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
    </>
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
