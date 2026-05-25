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
}

export function WorkbenchShell({
  leftPanel,
  rightPanel,
  leftLabel = 'Edit',
  rightLabel = 'Preview',
  variant = 'default',
}: WorkbenchShellProps) {
  const { activePanel, setActivePanel, showLeft, showRight } = useWorkbench()

  const gridClass = variant === 'builder' 
    ? 'lg:grid-cols-[1.5fr_1fr]' 
    : 'lg:grid-cols-2'

  return (
    <div className="workbench-shell flex-1 relative overflow-hidden flex flex-col">
      <div className={`workbench-grid flex-1 grid grid-cols-1 ${gridClass} overflow-hidden`}>
        {showLeft && (
          <WorkbenchPanel 
            className="border-r border-border bg-bg h-full" 
            scroll={variant !== 'builder'}
          >
            {leftPanel}
          </WorkbenchPanel>
        )}
        {showRight && (
          <WorkbenchPanel className="bg-bg-inset h-full" scroll={false}>
            {rightPanel}
          </WorkbenchPanel>
        )}
      </div>

      <WorkbenchMobileNav
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
      />
    </div>
  )
}
