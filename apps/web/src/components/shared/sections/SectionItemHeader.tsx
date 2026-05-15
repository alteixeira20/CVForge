'use client'

import { Icon } from '@/components/ui/Icon'
import { ExpandCollapseButton } from '@/components/shared/workbench/ExpandCollapseButton'

interface SectionItemHeaderProps {
  title: string
  subtitle?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

export function SectionItemHeader({
  title,
  subtitle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isExpanded,
  onToggle,
}: SectionItemHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="inline-flex items-center justify-center w-6 h-6 rounded text-ink-3 hover:text-ember disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Move Up"
        >
          <Icon name="arrow-up" size={12} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="inline-flex items-center justify-center w-6 h-6 rounded text-ink-3 hover:text-ember disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Move Down"
        >
          <Icon name="arrow-down" size={12} />
        </button>
      </div>

      <div className="flex-1 min-w-0 select-none px-1">
        <span className="text-sm font-medium text-ink block truncate">
          {title || 'Untitled Item'}
        </span>
        {subtitle && (
          <span className="text-xs text-ink-3 block truncate opacity-70">{subtitle}</span>
        )}
      </div>

      <ExpandCollapseButton
        isExpanded={isExpanded ?? false}
        onToggle={onToggle ?? (() => {})}
        size="sm"
      />
    </div>
  )
}
