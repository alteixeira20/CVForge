'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { WorkExperienceItem } from './WorkExperienceItem'

export function WorkExperienceEditor() {
  const { state, addSectionItem } = useCV()
  const { workExperience } = state.resume

  const handleAdd = () => {
    addSectionItem('workExperience')
    // We can't easily auto-expand here without knowing the new ID before it hits state, 
    // but the reducer handles adding to the end.
  }

  return (
    <RepeatableSectionEditor
      title="Work Experience"
      icon="activity"
      addLabel="Add Experience"
      emptyLabel="No experience added yet"
      items={workExperience}
      onAdd={handleAdd}
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
