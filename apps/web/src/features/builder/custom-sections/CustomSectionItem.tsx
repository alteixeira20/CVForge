'use client'

import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type CustomSection } from '@/types/cv'
import { linesToBullets } from './customSectionText'
import { useDescriptionModeToggle } from '../hooks/useDescriptionModeToggle'
import { DescriptionField } from '../shared/DescriptionField'
import { useRepeatableItemUpdate } from '../shared/useRepeatableItemUpdate'

interface CustomSectionItemProps {
  item: CustomSection
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function CustomSectionItem({ item, isExpanded, onToggle, isFirst, isLast }: CustomSectionItemProps) {
  const { mode, toggleMode } = useDescriptionModeToggle('customSections')
  const handleChange = useRepeatableItemUpdate<keyof CustomSection>('customSections', item.id)

  return (
    <RepeatableSectionItemShell
      id={item.id}
      sectionKey="customSections"
      title={item.title || 'New Custom Section'}
      isFirst={isFirst}
      isLast={isLast}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <FormField label="Section Title">
        <TextInput
          placeholder="e.g. Publications"
          value={item.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </FormField>
      <DescriptionField
        label="Description"
        placeholder="Add one detail per line..."
        value={item.bullets}
        onChange={(v) => handleChange('bullets', linesToBullets(v.join('\n')))}
        mode={mode}
        onToggleMode={toggleMode}
      />
    </RepeatableSectionItemShell>
  )
}
