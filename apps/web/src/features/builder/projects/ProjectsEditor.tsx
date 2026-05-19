'use client'

import { useCV } from '@/context/CVContext'
import { useAddFocusVersion } from '@/context/BuilderAddFocusContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { ProjectItem } from './ProjectItem'

export function ProjectsEditor() {
  const { state } = useCV()
  const { projects } = state.resume
  const focusLatestVersion = useAddFocusVersion('projects')

  return (
    <RepeatableSectionEditor
      emptyLabel="No projects added yet"
      items={projects}
      focusLatestVersion={focusLatestVersion}
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <ProjectItem
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
