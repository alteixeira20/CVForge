'use client'

import { Icon } from '@/components/ui/Icon'
import { type DescriptionMode } from '@/types/cv'

interface DescriptionFormatToggleProps {
  mode: DescriptionMode
  onToggle: () => void
}

export function DescriptionFormatToggle({ mode, onToggle }: DescriptionFormatToggleProps) {
  const isBullets = mode === 'bullets'
  return (
    <button
      type="button"
      onClick={onToggle}
      className="iconbtn sm"
      title={isBullets ? 'Switch to paragraph mode' : 'Switch to bullet mode'}
    >
      <Icon name={isBullets ? 'list' : 'align-left'} size={12} />
    </button>
  )
}
