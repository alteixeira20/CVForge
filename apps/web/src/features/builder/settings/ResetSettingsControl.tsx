'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'

export function ResetSettingsControl() {
  const { resetSettings } = useCV()
  const [confirming, setConfirming] = useState(false)

  function handleReset() {
    resetSettings()
    setConfirming(false)
  }

  if (!confirming) {
    return (
      <div className="pt-1 pb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-[11px] text-ink-3 hover:text-ink-2 transition-colors cursor-pointer"
        >
          Reset PDF settings
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-bg-2/50 overflow-hidden">
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-[12px] font-medium text-ink">Reset PDF settings?</p>
          <p className="text-[11px] text-ink-3 mt-1 leading-relaxed">
            This restores layout, color, typography, spacing, visibility, and section-title settings. Your CV content stays unchanged.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="px-3 py-1 text-[11px] text-ink-3 hover:text-ink-2 border border-border hover:border-border-strong rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 text-[11px] text-ink bg-bg-3 hover:bg-border border border-border rounded transition-colors cursor-pointer"
          >
            Reset settings
          </button>
        </div>
      </div>
    </div>
  )
}
