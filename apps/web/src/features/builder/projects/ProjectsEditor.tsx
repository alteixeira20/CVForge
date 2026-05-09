'use client'

import { useCV } from '@/context/CVContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { ProjectItem } from './ProjectItem'

export function ProjectsEditor() {
  const { state, addSectionItem } = useCV()
  const { projects } = state.resume

  const handleAdd = () => {
    addSectionItem('projects')
  }

  return (
    <RepeatableSectionEditor
      title="Projects"
      icon="spark"
      addLabel="Add Project"
      emptyLabel="No projects added yet"
      items={projects}
      onAdd={handleAdd}
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
