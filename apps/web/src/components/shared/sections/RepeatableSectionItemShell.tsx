'use client'

import { type ReactNode } from 'react'
import { useCV, type RepeatableSectionKey } from '@/context/CVContext'
import { HoldDeleteButton } from './HoldDeleteButton'
import { SectionItemHeader } from './SectionItemHeader'

interface RepeatableSectionItemShellProps {
  id: string
  title: string
  subtitle?: string
  sectionKey: RepeatableSectionKey
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
  children: ReactNode
}

export function RepeatableSectionItemShell({
  id,
  title,
  subtitle,
  sectionKey,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
  children,
}: RepeatableSectionItemShellProps) {
  const { removeSectionItem, moveSectionItem } = useCV()

  return (
    <div className="rounded-lg border border-border bg-bg-3 shadow-sm overflow-hidden">
      <SectionItemHeader
        title={title}
        subtitle={subtitle}
        onMoveUp={() => moveSectionItem(sectionKey, id, 'up')}
        onMoveDown={() => moveSectionItem(sectionKey, id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 space-y-3 border-t border-border-faint animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
          <div className="flex justify-end pt-1">
            <HoldDeleteButton onDelete={() => removeSectionItem(sectionKey, id)} />
          </div>
        </div>
      )}
    </div>
  )
}
