'use client'

import { type ReactNode } from 'react'
import { useCV, type RepeatableSectionKey } from '@/context/CVContext'
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
    <div className="border-b border-border-faint last:border-none">
      <SectionItemHeader
        title={title}
        subtitle={subtitle}
        onRemove={() => removeSectionItem(sectionKey, id)}
        onMoveUp={() => moveSectionItem(sectionKey, id, 'up')}
        onMoveDown={() => moveSectionItem(sectionKey, id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <div className="pb-24 pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
