'use client'

import { FormField } from '@/components/shared/form/FormField'
import { FieldLabel } from '@/components/shared/form/FieldLabel'
import { TextInput } from '@/components/shared/form/TextInput'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type WorkExperience } from '@/types/cv'
import { useDescriptionModeToggle } from '../hooks/useDescriptionModeToggle'
import { DescriptionField } from '../shared/DescriptionField'
import { useRepeatableItemUpdate } from '../shared/useRepeatableItemUpdate'

interface WorkExperienceItemProps {
  item: WorkExperience
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function WorkExperienceItem({ item, isExpanded, onToggle, isFirst, isLast }: WorkExperienceItemProps) {
  const { mode, toggleMode } = useDescriptionModeToggle('workExperience')
  const handleChange = useRepeatableItemUpdate<keyof WorkExperience>('workExperience', item.id)

  const handleCurrentChange = (checked: boolean) => {
    handleChange('isCurrent', checked)
    if (checked) {
      handleChange('endDate', 'Present')
    } else if (item.endDate === 'Present') {
      handleChange('endDate', '')
    }
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
            value={item.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </FormField>
        <FormField label="Start Date">
          <TextInput
            placeholder="e.g. Jan 2020"
            value={item.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>End Date</FieldLabel>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-border-strong text-ember focus:ring-ember bg-bg-2"
              checked={item.isCurrent}
              onChange={(e) => handleCurrentChange(e.target.checked)}
            />
            <span className="text-[10px] text-ink-3 uppercase tracking-wider font-semibold">
              Currently Work Here
            </span>
          </label>
        </div>
        <TextInput
          placeholder="e.g. Dec 2023"
          value={item.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>

      <DescriptionField
        label="Description"
        placeholder="Describe your impact..."
        value={item.bullets}
        onChange={(value) => handleChange('bullets', value)}
        mode={mode}
        onToggleMode={toggleMode}
      />
    </RepeatableSectionItemShell>
  )
}
