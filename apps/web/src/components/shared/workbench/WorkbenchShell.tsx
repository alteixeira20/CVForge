'use client'

import { type ReactNode } from 'react'
import { useWorkbench } from '@/hooks/useWorkbench'
import { WorkbenchMobileNav } from './WorkbenchMobileNav'
import { WorkbenchPanel } from './WorkbenchPanel'

interface WorkbenchShellProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
  leftLabel?: string
  rightLabel?: string
  variant?: 'default' | 'builder'
  notice?: ReactNode
}

export function WorkbenchShell({
  leftPanel,
  rightPanel,
  leftLabel = 'Edit',
  rightLabel = 'Preview',
  variant = 'default',
  notice,
}: WorkbenchShellProps) {
  const { activePanel, setActivePanel } = useWorkbench()
  // Both panels stay mounted so switching on mobile keeps editor state and
  // preview pages; below lg the inactive panel is hidden with CSS only.
  const leftVisibility = activePanel === 'left' ? '' : 'hidden lg:block'
  const rightVisibility = activePanel === 'right' ? '' : 'hidden lg:block'

  const gridClass = variant === 'builder' 
    ? 'lg:grid-cols-[1.5fr_1fr]' 
    : 'lg:grid-cols-2'

  return (
    <main className="workbench-shell flex-1 relative overflow-hidden flex flex-col">
      {notice}
      <div className={`workbench-grid flex-1 grid grid-cols-1 ${gridClass} overflow-hidden`}>
        <WorkbenchPanel
          className={`workbench-panel-editor border-r border-border h-full ${leftVisibility}`}
          scroll={variant !== 'builder'}
        >
          {leftPanel}
        </WorkbenchPanel>
        <WorkbenchPanel className={`bg-bg-inset h-full ${rightVisibility}`} scroll={false}>
          {rightPanel}
        </WorkbenchPanel>
      </div>

      <WorkbenchMobileNav
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
      />
    </main>
  )
}
