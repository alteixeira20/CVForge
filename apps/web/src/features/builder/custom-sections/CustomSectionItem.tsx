'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { MultilineListField } from '@/components/shared/form/MultilineListField'
import { DescriptionFormatToggle } from '@/components/shared/form/DescriptionFormatToggle'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type CustomSection } from '@/types/cv'
import { linesToBullets } from './customSectionText'

interface CustomSectionItemProps {
  item: CustomSection
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function CustomSectionItem({ item, isExpanded, onToggle, isFirst, isLast }: CustomSectionItemProps) {
  const { state, updateSectionItem, updateSettingsField } = useCV()
  const mode = state.settings.descriptionMode.customSections

  const handleChange = (field: keyof CustomSection, value: unknown) => {
    updateSectionItem('customSections', item.id, field, value)
  }

  const toggleMode = () => {
    updateSettingsField('descriptionMode', {
      ...state.settings.descriptionMode,
      customSections: mode === 'bullets' ? 'paragraph' : 'bullets',
    })
  }

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
      <MultilineListField
        label="Description"
        placeholder="Add one detail per line..."
        value={item.bullets}
        onChange={(v) => handleChange('bullets', linesToBullets(v.join('\n')))}
        action={<DescriptionFormatToggle mode={mode} onToggle={toggleMode} />}
      />
    </RepeatableSectionItemShell>
  )
}
