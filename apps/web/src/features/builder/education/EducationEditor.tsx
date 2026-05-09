'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { EducationItem } from './EducationItem'

export function EducationEditor() {
  const { state, addSectionItem } = useCV()
  const { education } = state.resume

  const handleAdd = () => {
    addSectionItem('education')
  }

  return (
    <RepeatableSectionEditor
      title="Education"
      icon="fold"
      addLabel="Add Education"
      emptyLabel="No education added yet"
      items={education}
      onAdd={handleAdd}
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <EducationItem
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
