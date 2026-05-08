'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { SectionItemHeader } from '@/components/shared/sections/SectionItemHeader'
import { type Language } from '@/types/cv'

interface LanguageItemProps {
  item: Language
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function LanguageItem({
  item,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}: LanguageItemProps) {
  const { updateSectionItem, removeSectionItem, moveSectionItem } = useCV()

  const handleChange = (field: keyof Language, value: unknown) => {
    updateSectionItem('languages', item.id, field, value)
  }

  return (
    <div className="border-b border-border-faint last:border-none">
      <SectionItemHeader
        title={item.name || 'New Language'}
        subtitle={item.proficiency}
        onRemove={() => removeSectionItem('languages', item.id)}
        onMoveUp={() => moveSectionItem('languages', item.id, 'up')}
        onMoveDown={() => moveSectionItem('languages', item.id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      {isExpanded && (
        <div className="pb-24 pt-4 space-y-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <FieldGroup columns={2}>
            <FormField label="Language">
              <TextInput
                placeholder="e.g. English"
                value={item.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </FormField>
            <FormField label="Proficiency">
              <TextInput
                placeholder="e.g. Native, Professional"
                value={item.proficiency}
                onChange={(e) => handleChange('proficiency', e.target.value)}
              />
            </FormField>
          </FieldGroup>
        </div>
      )}
    </div>
  )
}
