'use client'

import { Fragment, type ReactNode, useState, useEffect, useRef } from 'react'
import { type IconName } from '@/components/ui/Icon'
import { EmptySectionState } from './EmptySectionState'
import { SectionHeader } from './SectionHeader'

interface RepeatableItemRenderProps<T> {
  item: T
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

interface RepeatableSectionEditorProps<T extends { id: string }> {
  title: string
  icon: IconName
  addLabel: string
  emptyLabel: string
  items: T[]
  onAdd?: () => void
  renderItem: (props: RepeatableItemRenderProps<T>) => ReactNode
  hideTitle?: boolean
  focusLatestVersion?: number
}

export function RepeatableSectionEditor<T extends { id: string }>({
  title,
  icon,
  addLabel,
  emptyLabel,
  items,
  onAdd,
  renderItem,
  hideTitle = false,
  focusLatestVersion = 0,
}: RepeatableSectionEditorProps<T>) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(items.length > 0 ? [items[0].id] : [])
  )

  const itemsRef = useRef(items)
  itemsRef.current = items

  const isExpanded = (id: string) => expandedIds.has(id)

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  useEffect(() => {
    if (focusLatestVersion === 0 || itemsRef.current.length === 0) return
    const lastId = itemsRef.current[itemsRef.current.length - 1].id
    setExpandedIds(new Set([lastId]))
  }, [focusLatestVersion])

  const showHeader = !hideTitle || !!onAdd

  return (
    <div className="space-y-2">
      {showHeader && (
        <SectionHeader
          title={hideTitle ? undefined : title}
          icon={hideTitle ? undefined : icon}
          onAdd={onAdd}
          addLabel={addLabel}
        />
      )}
      {items.length === 0 && <EmptySectionState>{emptyLabel}</EmptySectionState>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            {renderItem({
              item,
              isExpanded: isExpanded(item.id),
              onToggle: () => toggleExpanded(item.id),
              isFirst: index === 0,
              isLast: index === items.length - 1,
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
