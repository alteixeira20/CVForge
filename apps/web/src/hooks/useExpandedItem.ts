'use client'

import { useState } from 'react'

export function useExpandedItem<T extends { id: string }>(items: T[]) {
  const [expandedId, setExpandedId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  )

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return { expandedId, toggleExpanded }
}
