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
    <div className="flex items-center gap-12 py-12 group">
      <div 
        className="flex-1 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-8">
          <Icon 
            name="chevron-right" 
            size={12} 
            className={`text-ink-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          />
          <span className="text-sm font-medium text-ink truncate max-w-[200px] md:max-w-none">
            {title || 'Untitled Item'}
          </span>
          {subtitle && (
            <span className="text-xs text-ink-3 truncate opacity-60">
              — {subtitle}
            </span>
          )}
        </div>
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
        <button
          onClick={onRemove}
          className="iconbtn sm hover:text-ember"
          title="Remove"
        >
          <Icon name="x" size={12} />
        </button>
      </div>
    </div>
  )
}
