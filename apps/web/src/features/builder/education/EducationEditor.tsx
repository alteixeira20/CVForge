'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { SectionHeader } from '@/components/shared/sections/SectionHeader'
import { EducationItem } from './EducationItem'

export function EducationEditor() {
  const { state, addSectionItem } = useCV()
  const { education } = state.resume
  const [expandedId, setExpandedId] = useState<string | null>(
    education.length > 0 ? education[0].id : null
  )

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAdd = () => {
    addSectionItem('education')
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Education"
        icon="fold"
        onAdd={handleAdd}
        addLabel="Add Education"
      />

      {education.length === 0 && (
        <div className="p-32 text-center border-2 border-dashed border-border-faint rounded-xl opacity-50 select-none">
          <p className="text-xs text-ink-4 uppercase tracking-widest">No education added yet</p>
        </div>
      )}

      <div className="space-y-4">
        {education.map((item, index) => (
          <EducationItem
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
            isFirst={index === 0}
            isLast={index === education.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
