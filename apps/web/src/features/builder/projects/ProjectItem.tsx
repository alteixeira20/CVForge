'use client'

import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
import { type Project } from '@/types/cv'
import { useDescriptionModeToggle } from '../hooks/useDescriptionModeToggle'
import { DescriptionField } from '../shared/DescriptionField'
import { useRepeatableItemUpdate } from '../shared/useRepeatableItemUpdate'

interface ProjectItemProps {
  item: Project
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

export function ProjectItem({ item, isExpanded, onToggle, isFirst, isLast }: ProjectItemProps) {
  const { mode, toggleMode } = useDescriptionModeToggle('projects')
  const handleChange = useRepeatableItemUpdate<keyof Project>('projects', item.id)

  return (
    <RepeatableSectionItemShell
      id={item.id}
      sectionKey="projects"
      title={item.name || 'New Project'}
      subtitle={item.link}
      isFirst={isFirst}
      isLast={isLast}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
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

      <DescriptionField
        label="Description"
        placeholder="Describe what you built and achieved..."
        value={item.bullets}
        onChange={(value) => handleChange('bullets', value)}
        mode={mode}
        onToggleMode={toggleMode}
      />
    </RepeatableSectionItemShell>
  )
}
