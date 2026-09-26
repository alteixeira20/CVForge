import { useEffect, useState } from 'react'
import { type RepeatableSectionKey } from '@/context/CVContext'
import { clearImportedSections, peekImportedSections } from './importExpansion'

export function useBuilderSectionState() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['profile', ...(peekImportedSections() ?? [])]),
  )
  useEffect(() => clearImportedSections(), [])
  const [focusVersions, setFocusVersions] = useState<Partial<Record<RepeatableSectionKey, number>>>({})

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const openSection = (id: string) => {
    setExpandedIds((prev) => new Set([...prev, id]))
  }

  const bumpFocus = (key: RepeatableSectionKey) => {
    setFocusVersions((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  return { expandedIds, focusVersions, toggleSection, openSection, bumpFocus }
}
