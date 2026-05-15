'use client'

import { Icon } from '@/components/ui/Icon'

interface SectionItemHeaderProps {
  title: string
  subtitle?: string
  onRemove: () => void
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
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isExpanded,
  onToggle,
}: SectionItemHeaderProps) {
  return (
    <div className="flex items-center gap-8 px-3 py-2 group">
      <button
        onClick={onToggle}
        className="iconbtn sm shrink-0"
        title={isExpanded ? 'Collapse' : 'Expand'}
        aria-expanded={isExpanded}
      >
        <Icon
          name="chevron-right"
          size={12}
          className={`text-ink-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      <div className="flex-1 min-w-0 select-none">
        <span className="text-sm font-medium text-ink block truncate">
          {title || 'Untitled Item'}
        </span>
        {subtitle && (
          <span className="text-xs text-ink-3 block truncate opacity-70">{subtitle}</span>
        )}
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveUp && (
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="iconbtn sm disabled:opacity-20"
            title="Move Up"
          >
            <Icon name="chevron-down" size={12} className="rotate-180" />
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="iconbtn sm disabled:opacity-20"
            title="Move Down"
          >
            <Icon name="chevron-down" size={12} />
          </button>
        )}
        <button onClick={onRemove} className="iconbtn sm hover:text-ember" title="Remove">
          <Icon name="x" size={12} />
        </button>
      </div>
    </div>
  )
}
