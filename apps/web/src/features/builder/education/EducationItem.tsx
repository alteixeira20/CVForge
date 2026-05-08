'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { TextArea } from '@/components/shared/form/TextArea'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { SectionItemHeader } from '@/components/shared/sections/SectionItemHeader'
import { type Education } from '@/types/cv'

interface EducationItemProps {
  item: Education
  index: number
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
  const { updateSectionItem, removeSectionItem, moveSectionItem } = useCV()

  const handleChange = (field: keyof Education, value: unknown) => {
    updateSectionItem('education', item.id, field, value)
  }

  return (
    <div className="border-b border-border-faint last:border-none">
      <SectionItemHeader
        title={item.school || 'New Institution'}
        subtitle={item.degree}
        onRemove={() => removeSectionItem('education', item.id)}
        onMoveUp={() => moveSectionItem('education', item.id, 'up')}
        onMoveDown={() => moveSectionItem('education', item.id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      {isExpanded && (
        <div className="pb-24 pt-4 space-y-20 animate-in fade-in slide-in-from-top-2 duration-200">
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

          <FormField label="Additional Details (One per line)">
            <TextArea
              placeholder="Minors, awards, or relevant coursework..."
              value={item.details.join('\n')}
              onChange={(e) => handleChange('details', e.target.value.split('\n'))}
            />
          </FormField>
        </div>
      )}
    </div>
  )
}
