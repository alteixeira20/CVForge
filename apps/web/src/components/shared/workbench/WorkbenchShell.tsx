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
}

export function WorkbenchShell({
  leftPanel,
  rightPanel,
  leftLabel = 'Edit',
  rightLabel = 'Preview',
}: WorkbenchShellProps) {
  const { activePanel, setActivePanel, showLeft, showRight } = useWorkbench()

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-var(--header-h))]">
        {showLeft && (
          <WorkbenchPanel className="border-r border-border bg-bg h-full">
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
