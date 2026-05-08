'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { SectionHeader } from '@/components/shared/sections/SectionHeader'
import { LanguageItem } from './LanguageItem'

export function LanguagesEditor() {
  const { state, addSectionItem } = useCV()
  const { languages } = state.resume
  const [expandedId, setExpandedId] = useState<string | null>(
    languages.length > 0 ? languages[0].id : null
  )

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAdd = () => {
    addSectionItem('languages')
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Languages"
        icon="users"
        onAdd={handleAdd}
        addLabel="Add Language"
      />

      {languages.length === 0 && (
        <div className="p-32 text-center border-2 border-dashed border-border-faint rounded-xl opacity-50 select-none">
          <p className="text-xs text-ink-4 uppercase tracking-widest">No languages added yet</p>
        </div>
      )}

      <div className="space-y-4">
        {languages.map((item, index) => (
          <LanguageItem
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
            isFirst={index === 0}
            isLast={index === languages.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
