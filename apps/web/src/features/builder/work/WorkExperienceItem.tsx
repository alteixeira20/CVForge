'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { MultilineListField } from '@/components/shared/form/MultilineListField'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type WorkExperience } from '@/types/cv'

interface WorkExperienceItemProps {
  item: WorkExperience
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function WorkExperienceItem({
  item,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}: WorkExperienceItemProps) {
  const { updateSectionItem } = useCV()

  const handleChange = (field: keyof WorkExperience, value: unknown) => {
    updateSectionItem('workExperience', item.id, field, value)
  }

  return (
    <RepeatableSectionItemShell
      id={item.id}
      sectionKey="workExperience"
      title={item.company || 'New Company'}
      subtitle={item.role}
      isFirst={isFirst}
      isLast={isLast}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <FieldGroup columns={2}>
        <FormField label="Company">
          <TextInput
            placeholder="e.g. Acme Corp"
            value={item.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </FormField>
        <FormField label="Role">
          <TextInput
            placeholder="e.g. Senior Developer"
            value={item.role}
            onChange={(e) => handleChange('role', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup columns={2}>
        <FormField label="Location">
          <TextInput
            placeholder="e.g. Remote"
            value={item.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </FormField>
        <div className="flex items-end h-full pb-10">
          <label className="flex items-center gap-8 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-16 h-16 rounded border-border-strong text-ember focus:ring-ember bg-bg-2"
              checked={item.isCurrent}
              onChange={(e) => handleChange('isCurrent', e.target.checked)}
            />
            <span className="text-xs text-ink-3 uppercase tracking-wider font-semibold">Currently Work Here</span>
          </label>
        </div>
      </FieldGroup>

      <FieldGroup columns={2}>
        <FormField label="Start Date">
          <TextInput
            placeholder="e.g. Jan 2020"
            value={item.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </FormField>
        {!item.isCurrent && (
          <FormField label="End Date">
            <TextInput
              placeholder="e.g. Present"
              value={item.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </FormField>
        )}
      </FieldGroup>

      <MultilineListField
        label="Description / Bullets (One per line)"
        placeholder="Described your impact..."
        value={item.bullets}
        onChange={(value) => handleChange('bullets', value)}
      />
    </RepeatableSectionItemShell>
  )
}
