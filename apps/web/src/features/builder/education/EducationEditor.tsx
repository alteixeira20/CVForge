'use client'

import { useCV } from '@/context/CVContext'
import { useAddFocusVersion } from '@/context/BuilderAddFocusContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { EducationItem } from './EducationItem'

export function EducationEditor() {
  const { state } = useCV()
  const { education } = state.resume
  const focusLatestVersion = useAddFocusVersion('education')

  return (
    <RepeatableSectionEditor
      title="Education"
      icon="file-text"
      addLabel="Add Education"
      emptyLabel="No education added yet"
      items={education}
      hideTitle
      focusLatestVersion={focusLatestVersion}
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
