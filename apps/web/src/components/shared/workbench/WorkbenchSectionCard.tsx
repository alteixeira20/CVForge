'use client'

import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'

interface WorkbenchSectionCardProps {
  title: string
  icon: IconName
  status?: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
}

/**
 * A shared accordion-style card for workbench sections.
 */
export function WorkbenchSectionCard({
  title,
  icon,
  status,
  isExpanded,
  onToggle,
  children,
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
      {/* Accent Line */}
      <div
        className={`absolute left-0 top-10 bottom-10 w-[3px] rounded-r-sm transition-opacity ${
          isExpanded ? 'bg-ember opacity-100' : 'bg-ink-4 opacity-0 group-hover:opacity-40'
        }`}
      />

      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-10 p-4 pl-16 text-left outline-none"
      >
        <div className="flex items-center gap-10 overflow-hidden">
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
            <span
              className={`truncate text-[13px] font-medium tracking-tight transition-colors ${
                isExpanded ? 'text-ink' : 'text-ink-2 group-hover:text-ink'
              }`}
            >
              {title}
            </span>
            {status && (
              <span className="text-[9px] font-mono text-ink-4 uppercase tracking-[0.06em] truncate">
                {status}
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
            isExpanded
              ? 'bg-ember/10 text-ink-3'
              : 'bg-bg-3 text-ink-4 group-hover:bg-bg-2 group-hover:text-ink-3'
          }`}
        >
          <Icon
            name="chevron-down"
            size={13}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border-faint p-5 lg:p-6 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
