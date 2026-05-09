'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { MultilineListField } from '@/components/shared/form/MultilineListField'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type Education } from '@/types/cv'

interface EducationItemProps {
  item: Education
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function EducationItem({
  item,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}: EducationItemProps) {
  const { updateSectionItem } = useCV()

  const handleChange = (field: keyof Education, value: unknown) => {
    updateSectionItem('education', item.id, field, value)
  }

  return (
    <RepeatableSectionItemShell
      id={item.id}
      sectionKey="education"
      title={item.school || 'New Institution'}
      subtitle={item.degree}
      isFirst={isFirst}
      isLast={isLast}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <FieldGroup columns={2}>
        <FormField label="School / Institution">
          <TextInput
            placeholder="e.g. Stanford University"
            value={item.school}
            onChange={(e) => handleChange('school', e.target.value)}
          />
        </FormField>
        <FormField label="Degree / Major">
          <TextInput
            placeholder="e.g. B.S. Computer Science"
            value={item.degree}
            onChange={(e) => handleChange('degree', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup columns={2}>
        <FormField label="Location">
          <TextInput
            placeholder="e.g. Stanford, CA"
            value={item.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup columns={2}>
        <FormField label="Start Date">
          <TextInput
            placeholder="e.g. Sep 2016"
            value={item.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </FormField>
        <FormField label="End Date">
          <TextInput
            placeholder="e.g. Jun 2020"
            value={item.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <MultilineListField
        label="Additional Details (One per line)"
        placeholder="Minors, awards, or relevant coursework..."
        value={item.details}
        onChange={(value) => handleChange('details', value)}
      />
    </RepeatableSectionItemShell>
  )
}
