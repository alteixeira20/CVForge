'use client'

import { Icon } from '@/components/ui/Icon'

interface ExpandCollapseButtonProps {
  isExpanded: boolean
  onToggle: () => void
  title?: string
  size?: 'sm' | 'md'
}

export function ExpandCollapseButton({
  isExpanded,
  onToggle,
  title,
  size = 'md',
}: ExpandCollapseButtonProps) {
  const sizeClasses = size === 'sm'
    ? 'h-9 w-9 rounded-md'
    : 'h-10 w-10 rounded-lg'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={title ?? (isExpanded ? 'Collapse' : 'Expand')}
      title={title ?? (isExpanded ? 'Collapse' : 'Expand')}
      className={`inline-flex shrink-0 items-center justify-center transition-[background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 ${sizeClasses} ${
        isExpanded
          ? 'bg-ember/10 text-ember'
          : 'bg-bg-3/70 text-ink-3 hover:bg-bg-3 hover:text-ink'
      }`}
    >
      <Icon
        name="chevron-down"
        size={size === 'sm' ? 11 : 13}
        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
  )
}
