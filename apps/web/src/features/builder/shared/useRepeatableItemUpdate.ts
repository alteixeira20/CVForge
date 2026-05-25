'use client'

import { useCV } from '@/context/CVContext'
import { type RepeatableSectionKey } from '@/context/cvActions'

export function useRepeatableItemUpdate<TField extends string>(sectionKey: RepeatableSectionKey, itemId: string) {
  const { updateSectionItem } = useCV()

  return (field: TField, value: unknown) => {
    updateSectionItem(sectionKey, itemId, field, value)
  }
}
