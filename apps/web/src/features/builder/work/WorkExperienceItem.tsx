'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { TextArea } from '@/components/shared/form/TextArea'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { SectionItemHeader } from '@/components/shared/sections/SectionItemHeader'
import { type WorkExperience } from '@/types/cv'

interface WorkExperienceItemProps {
  item: WorkExperience
  index: number
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
  const { updateSectionItem, removeSectionItem, moveSectionItem } = useCV()

  const handleChange = (field: keyof WorkExperience, value: unknown) => {
    updateSectionItem('workExperience', item.id, field, value)
  }

  return (
    <div className="border-b border-border-faint last:border-none">
      <SectionItemHeader
        title={item.company || 'New Company'}
        subtitle={item.role}
        onRemove={() => removeSectionItem('workExperience', item.id)}
        onMoveUp={() => moveSectionItem('workExperience', item.id, 'up')}
        onMoveDown={() => moveSectionItem('workExperience', item.id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      {isExpanded && (
        <div className="pb-24 pt-4 space-y-20 animate-in fade-in slide-in-from-top-2 duration-200">
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

          <FormField label="Description / Bullets (One per line)">
            <TextArea
              placeholder="Described your impact..."
              value={item.bullets.join('\n')}
              onChange={(e) => handleChange('bullets', e.target.value.split('\n'))}
            />
          </FormField>
        </div>
      )}
    </div>
  )
}
