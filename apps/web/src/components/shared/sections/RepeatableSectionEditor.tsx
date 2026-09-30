'use client'

import { Fragment, type ReactNode, useState, useEffect, useRef } from 'react'
import { EmptySectionState } from './EmptySectionState'

interface RepeatableItemRenderProps<T> {
  item: T
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

interface RepeatableSectionEditorProps<T extends { id: string }> {
  emptyLabel: string
  items: T[]
  renderItem: (props: RepeatableItemRenderProps<T>) => ReactNode
  focusLatestVersion?: number
}

export function RepeatableSectionEditor<T extends { id: string }>({
  emptyLabel,
  items,
  renderItem,
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

  // Prune deleted item IDs from expandedIds so deleted cards do not linger in local state
  useEffect(() => {
    const validIds = new Set(items.map((item) => item.id))
    setExpandedIds((prev) => {
      let hasStale = false
      for (const id of prev) {
        if (!validIds.has(id)) {
          hasStale = true
          break
        }
      }
      if (!hasStale) return prev
      const next = new Set<string>()
      for (const id of prev) {
        if (validIds.has(id)) {
          next.add(id)
        }
      }
      return next
    })
  }, [items])

  return (
    <div className="space-y-2">
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
