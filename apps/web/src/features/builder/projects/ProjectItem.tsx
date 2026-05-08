'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { TextArea } from '@/components/shared/form/TextArea'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { SectionItemHeader } from '@/components/shared/sections/SectionItemHeader'
import { type Project } from '@/types/cv'

interface ProjectItemProps {
  item: Project
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function ProjectItem({
  item,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}: ProjectItemProps) {
  const { updateSectionItem, removeSectionItem, moveSectionItem } = useCV()

  const handleChange = (field: keyof Project, value: unknown) => {
    updateSectionItem('projects', item.id, field, value)
  }

  return (
    <div className="border-b border-border-faint last:border-none">
      <SectionItemHeader
        title={item.name || 'New Project'}
        subtitle={item.link}
        onRemove={() => removeSectionItem('projects', item.id)}
        onMoveUp={() => moveSectionItem('projects', item.id, 'up')}
        onMoveDown={() => moveSectionItem('projects', item.id, 'down')}
        isFirst={isFirst}
        isLast={isLast}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      {isExpanded && (
        <div className="pb-24 pt-4 space-y-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <FieldGroup columns={2}>
            <FormField label="Project Name">
              <TextInput
                placeholder="e.g. CVForge"
                value={item.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </FormField>
            <FormField label="Project Link">
              <TextInput
                placeholder="e.g. github.com/user/repo"
                value={item.link}
                onChange={(e) => handleChange('link', e.target.value)}
              />
            </FormField>
          </FieldGroup>

          <FieldGroup columns={2}>
            <FormField label="Start Date">
              <TextInput
                placeholder="e.g. Jan 2024"
                value={item.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </FormField>
            <FormField label="End Date">
              <TextInput
                placeholder="e.g. Present"
                value={item.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </FormField>
          </FieldGroup>

          <FormField label="Project Details (One per line)">
            <TextArea
              placeholder="Described what you built and achieved..."
              value={item.bullets.join('\n')}
              onChange={(e) => handleChange('bullets', e.target.value.split('\n'))}
            />
          </FormField>
        </div>
      )}
    </div>
  )
}
