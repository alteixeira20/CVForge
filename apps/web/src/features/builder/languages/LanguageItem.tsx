'use client'

import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type Language } from '@/types/cv'
import { useRepeatableItemUpdate } from '../shared/useRepeatableItemUpdate'

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
  const handleChange = useRepeatableItemUpdate<keyof Language>('languages', item.id)

  return (
    <RepeatableSectionItemShell
      id={item.id}
      sectionKey="languages"
      title={item.name || 'New Language'}
      subtitle={item.proficiency}
      isFirst={isFirst}
      isLast={isLast}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
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
    </RepeatableSectionItemShell>
  )
}
