'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextArea } from '@/components/shared/form/TextArea'
import { TextInput } from '@/components/shared/form/TextInput'
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

export function CustomSectionItem(props: CustomSectionItemProps) {
  const { item, isExpanded, onToggle, isFirst, isLast } = props
  const { updateSectionItem } = useCV()

  const handleChange = (field: keyof CustomSection, value: unknown) => {
    updateSectionItem('customSections', item.id, field, value)
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
      <CustomSectionFields item={item} onChange={handleChange} />
    </RepeatableSectionItemShell>
  )
}

function CustomSectionFields({
  item,
  onChange,
}: {
  item: CustomSection
  onChange: (field: keyof CustomSection, value: unknown) => void
}) {
  return (
    <>
      <FormField label="Section Title">
        <TextInput
          placeholder="e.g. Publications"
          value={item.title}
          onChange={(event) => onChange('title', event.target.value)}
        />
      </FormField>
      <FormField label="Bullets (One per line)">
        <TextArea
          placeholder="Add one custom section detail per line..."
          value={item.bullets.join('\n')}
          onChange={(event) => onChange('bullets', linesToBullets(event.target.value))}
        />
      </FormField>
    </>
  )
}
