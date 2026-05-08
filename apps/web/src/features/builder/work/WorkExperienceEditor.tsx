'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { SectionHeader } from '@/components/shared/sections/SectionHeader'
import { WorkExperienceItem } from './WorkExperienceItem'

export function WorkExperienceEditor() {
  const { state, addSectionItem } = useCV()
  const { workExperience } = state.resume
  const [expandedId, setExpandedId] = useState<string | null>(
    workExperience.length > 0 ? workExperience[0].id : null
  )

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAdd = () => {
    addSectionItem('workExperience')
    // We can't easily auto-expand here without knowing the new ID before it hits state, 
    // but the reducer handles adding to the end.
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Work Experience"
        icon="activity"
        onAdd={handleAdd}
        addLabel="Add Experience"
      />

      {workExperience.length === 0 && (
        <div className="p-32 text-center border-2 border-dashed border-border-faint rounded-xl opacity-50 select-none">
          <p className="text-xs text-ink-4 uppercase tracking-widest">No experience added yet</p>
        </div>
      )}

      <div className="space-y-4">
        {workExperience.map((item, index) => (
          <WorkExperienceItem
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
            isFirst={index === 0}
            isLast={index === workExperience.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
