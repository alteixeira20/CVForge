'use client'

import { type WorkbenchPanelId } from '@/hooks/useWorkbench'

interface WorkbenchMobileNavProps {
  activePanel: WorkbenchPanelId
  onPanelChange: (panel: WorkbenchPanelId) => void
  leftLabel: string
  rightLabel: string
}

export function WorkbenchMobileNav({
  activePanel,
  onPanelChange,
  leftLabel,
  rightLabel,
}: WorkbenchMobileNavProps) {
  return (
    <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex bg-bg-3 border border-border-strong rounded-full p-4 shadow-lg">
      <button
        onClick={() => onPanelChange('left')}
        className={`px-16 py-8 rounded-full text-sm font-medium transition-colors ${
          activePanel === 'left' ? 'bg-ember text-white shadow-ember' : 'text-ink-3 hover:text-ink'
        }`}
      >
        {leftLabel}
      </button>
      <button
        onClick={() => onPanelChange('right')}
        className={`px-16 py-8 rounded-full text-sm font-medium transition-colors ${
          activePanel === 'right' ? 'bg-ember text-white shadow-ember' : 'text-ink-3 hover:text-ink'
        }`}
      >
        {rightLabel}
      </button>
    </div>
  )
}
