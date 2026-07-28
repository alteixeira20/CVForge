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
    <div className="workbench-mobile-nav lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 bg-bg-2/95 backdrop-blur-sm border border-border rounded-xl p-1 shadow-lg w-[260px]">
      <button
        type="button"
        onClick={() => onPanelChange('left')}
        aria-pressed={activePanel === 'left'}
        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 ${
          activePanel === 'left'
            ? 'bg-ember text-bg shadow-sm'
            : 'text-ink-3 hover:text-ink hover:bg-bg-3/60'
        }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onPanelChange('right')}
        aria-pressed={activePanel === 'right'}
        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 ${
          activePanel === 'right'
            ? 'bg-ember text-bg shadow-sm'
            : 'text-ink-3 hover:text-ink hover:bg-bg-3/60'
        }`}
      >
        {rightLabel}
      </button>
    </div>
  )
}
