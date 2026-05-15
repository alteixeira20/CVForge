'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { WorkExperienceItem } from './WorkExperienceItem'

export function WorkExperienceEditor() {
  const { state } = useCV()
  const { workExperience } = state.resume

  return (
    <RepeatableSectionEditor
      title="Work Experience"
      icon="activity"
      addLabel="Add Experience"
      emptyLabel="No experience added yet"
      items={workExperience}
      hideTitle
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <WorkExperienceItem
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
