'use client'

import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'

interface WorkbenchSectionCardProps {
  title: ReactNode
  icon: IconName
  status?: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
  headerActions?: ReactNode
  className?: string
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
}: WorkbenchSectionCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isExpanded
          ? 'border-border-strong bg-bg-2 shadow-sm'
          : 'border-border bg-bg hover:border-border-strong hover:bg-bg-2/50'
      } ${className}`}
    >
      <div
        className={`absolute left-0 top-10 bottom-10 w-[3px] rounded-r-sm transition-opacity ${
          isExpanded ? 'bg-ember opacity-100' : 'bg-ink-4 opacity-0 group-hover:opacity-40'
        }`}
      />

      <div className="flex w-full items-center gap-10 p-4 pl-16">
        <div className="flex items-center gap-10 flex-1 overflow-hidden min-w-0">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
              isExpanded
                ? 'border-ember/30 bg-ember/10 text-ember'
                : 'border-border bg-bg-3 text-ink-3 group-hover:text-ink-2'
            }`}
          >
            <Icon name={icon} size={13} />
          </div>
          <div className="flex flex-col min-w-0">
            <div
              className={`truncate text-[13px] font-medium tracking-tight transition-colors ${
                isExpanded ? 'text-ink' : 'text-ink-2 group-hover:text-ink'
              }`}
            >
              {title}
            </div>
            {status && (
              <span className="text-[9px] font-mono text-ink-4 uppercase tracking-[0.06em] truncate">
                {status}
              </span>
            )}
          </div>
        </div>

        {headerActions && (
          <div className="flex items-center gap-2 shrink-0">{headerActions}</div>
        )}

        <button
          onClick={onToggle}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all ${
            isExpanded
              ? 'border-ember/30 bg-ember/10 text-ember'
              : 'border-border bg-bg-3 text-ink-3 hover:border-border-strong hover:bg-bg-2 hover:text-ink'
          }`}
          title={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          <Icon
            name="chevron-down"
            size={13}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-border-faint p-5 lg:p-6 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
