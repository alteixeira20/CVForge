'use client'

import { useState } from 'react'

export function useExpandedItem<T extends { id: string }>(items: T[]) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(items.length > 0 ? [items[0].id] : [])
  )

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isExpanded = (id: string) => expandedIds.has(id)

  return { expandedIds, toggleExpanded, isExpanded }
}
