'use client'

import { useCV } from '@/context/CVContext'
import { useAddFocusVersion } from '@/context/BuilderAddFocusContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { WorkExperienceItem } from './WorkExperienceItem'

export function WorkExperienceEditor() {
  const { state } = useCV()
  const { workExperience } = state.resume
  const focusLatestVersion = useAddFocusVersion('workExperience')

  return (
    <RepeatableSectionEditor
      title="Work Experience"
      icon="activity"
      addLabel="Add Experience"
      emptyLabel="No experience added yet"
      items={workExperience}
      hideTitle
      focusLatestVersion={focusLatestVersion}
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
