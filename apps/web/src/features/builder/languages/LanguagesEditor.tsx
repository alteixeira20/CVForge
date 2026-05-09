'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { LanguageItem } from './LanguageItem'

export function LanguagesEditor() {
  const { state, addSectionItem } = useCV()
  const { languages } = state.resume

  const handleAdd = () => {
    addSectionItem('languages')
  }

  return (
    <RepeatableSectionEditor
      title="Languages"
      icon="users"
      addLabel="Add Language"
      emptyLabel="No languages added yet"
      items={languages}
      onAdd={handleAdd}
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
