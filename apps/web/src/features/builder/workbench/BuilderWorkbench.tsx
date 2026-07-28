'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { EmberBackground } from '@/components/ui/EmberBackground'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { useCV } from '@/context/CVContext'
import { BuilderEditorPanel } from './BuilderEditorPanel'
import { BuilderPreviewPanel } from './BuilderPreviewPanel'

export function BuilderWorkbench() {
  const { state } = useCV()
  const { profile } = state.resume

  return (
    <div className="app-shell h-screen overflow-hidden">
      <EmberBackground subdued />
      <AppHeader title={profile.name || 'Untitled CV'} />
      <WorkbenchShell
        leftPanel={<BuilderEditorPanel />}
        rightPanel={<BuilderPreviewPanel state={state} />}
        leftLabel="Edit"
        rightLabel="Preview"
        variant="builder"
      />
    </div>
  )
}
