'use client'

import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ExpandCollapseButton } from './ExpandCollapseButton'

interface WorkbenchSectionCardProps {
  title: ReactNode
  icon: IconName
  status?: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
  headerActions?: ReactNode
  className?: string
  isVisible?: boolean
  onToggleVisibility?: () => void
  reorderActions?: ReactNode
}

export function WorkbenchSectionCard({
  title,
  icon,
  status,
  isExpanded,
  onToggle,
  children,
  headerActions,
  className = '',
  isVisible = true,
  onToggleVisibility,
  reorderActions,
}: WorkbenchSectionCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isExpanded
          ? 'border-border-strong bg-bg-2 shadow-sm'
          : 'border-border bg-bg hover:border-border-strong hover:bg-bg-2/50'
      } ${!isVisible ? 'opacity-75 hover:opacity-100' : ''} ${className}`}
    >
      <div
        className={`absolute left-0 top-10 bottom-10 w-[3px] rounded-r-sm transition-opacity ${
          isExpanded ? 'bg-ember opacity-100' : 'bg-ink-4 opacity-0 group-hover:opacity-40'
        }`}
      />

      <div className="flex w-full items-center gap-10 p-4 pl-12 lg:pl-16">
        <div className="flex items-center gap-10 flex-1 overflow-hidden min-w-0">
          {reorderActions && (
            <div className="flex flex-col shrink-0">
              {reorderActions}
            </div>
          )}
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
              isExpanded
                ? 'border-ember/30 bg-ember/10 text-ember'
                : 'border-border bg-bg-3 text-ink-3 group-hover:text-ink-2'
            } ${!isVisible ? 'grayscale opacity-50' : ''}`}
          >
            <Icon name={icon} size={13} />
          </div>
          <div className="flex flex-col min-w-0">
            <div
              className={`flex items-center gap-8 truncate text-[14px] font-medium tracking-tight transition-colors ${
                isExpanded ? 'text-ink' : 'text-ink-2 group-hover:text-ink'
              } ${!isVisible ? 'text-ink-4' : ''}`}
            >
              {title}
              {!isVisible && (
                <span className="text-[10px] font-normal text-ink-4 italic shrink-0">
                  Hidden from PDF
                </span>
              )}
            </div>
            {status && (
              <span className="text-[9px] font-mono text-ink-4 uppercase tracking-[0.06em] truncate">
                {status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onToggleVisibility && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisibility()
              }}
              className={`btn sm ghost px-6 h-8 hover:bg-bg-3 ${
                !isVisible ? 'text-ember' : 'text-ink-4 hover:text-ink-2'
              }`}
              title={isVisible ? 'Hide section from PDF' : 'Show section in PDF'}
              aria-label={isVisible ? 'Hide section from PDF' : 'Show section in PDF'}
            >
              <Icon name={isVisible ? 'eye' : 'eye-off'} size={13} />
            </button>
          )}

          {isExpanded && headerActions && (
            <div className="flex items-center gap-2 shrink-0">{headerActions}</div>
          )}

          <ExpandCollapseButton
            isExpanded={isExpanded}
            onToggle={onToggle}
            title={isExpanded ? 'Collapse section' : 'Expand section'}
            size="md"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border-faint p-5 lg:p-6 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
