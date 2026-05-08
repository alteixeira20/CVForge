'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { SectionHeader } from '@/components/shared/sections/SectionHeader'
import { ProjectItem } from './ProjectItem'

export function ProjectsEditor() {
  const { state, addSectionItem } = useCV()
  const { projects } = state.resume
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  )

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAdd = () => {
    addSectionItem('projects')
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Projects"
        icon="spark"
        onAdd={handleAdd}
        addLabel="Add Project"
      />

      {projects.length === 0 && (
        <div className="p-32 text-center border-2 border-dashed border-border-faint rounded-xl opacity-50 select-none">
          <p className="text-xs text-ink-4 uppercase tracking-widest">No projects added yet</p>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((item, index) => (
          <ProjectItem
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
            isFirst={index === 0}
            isLast={index === projects.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
