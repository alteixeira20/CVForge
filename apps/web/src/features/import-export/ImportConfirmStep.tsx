'use client'

import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'

interface ImportConfirmStepProps {
  icon: IconName
  title: string
  description: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ImportConfirmStep({ icon, title, description, confirmLabel, onConfirm, onCancel }: ImportConfirmStepProps) {
  return (
    <div className="space-y-6 py-2">
      <div className="p-4 rounded-lg bg-ember/5 border border-ember/20 space-y-3">
        <div className="flex items-center gap-10">
          <Icon name={icon} size={16} className="text-ember" />
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
        </div>
        <p className="text-xs text-ink-3 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onConfirm} className="btn primary w-full justify-center h-11">
          {confirmLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn w-full justify-center h-11">
          Cancel
        </button>
      </div>
    </div>
  )
}
