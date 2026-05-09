'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { CustomSectionItem } from './CustomSectionItem'

export function CustomSectionsEditor() {
  const { state, addSectionItem } = useCV()
  const { customSections } = state.resume

  const handleAdd = () => {
    addSectionItem('customSections')
  }

  return (
    <RepeatableSectionEditor
      title="Custom Sections"
      icon="fold"
      addLabel="Add Section"
      emptyLabel="No custom sections added yet"
      items={customSections}
      onAdd={handleAdd}
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <CustomSectionItem
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
