'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { LanguageItem } from './LanguageItem'

export function LanguagesEditor() {
  const { state } = useCV()
  const { languages } = state.resume

  return (
    <RepeatableSectionEditor
      title="Languages"
      icon="flame"
      addLabel="Add Language"
      emptyLabel="No languages added yet"
      items={languages}
      hideTitle
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <LanguageItem
          item={item}
          isExpanded={isExpanded}
          onToggle={onToggle}
          isFirst={isFirst}
          isLast={isLast}
        />
      )}
    />
  )
}
