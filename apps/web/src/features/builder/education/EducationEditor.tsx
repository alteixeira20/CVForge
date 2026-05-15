'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { EducationItem } from './EducationItem'

export function EducationEditor() {
  const { state } = useCV()
  const { education } = state.resume

  return (
    <RepeatableSectionEditor
      title="Education"
      icon="file-text"
      addLabel="Add Education"
      emptyLabel="No education added yet"
      items={education}
      hideTitle
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
