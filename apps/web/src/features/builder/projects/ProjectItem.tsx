'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { MultilineListField } from '@/components/shared/form/MultilineListField'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { RepeatableSectionItemShell } from '@/components/shared/sections/RepeatableSectionItemShell'
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
  const { updateSectionItem } = useCV()

  const handleChange = (field: keyof Project, value: unknown) => {
    updateSectionItem('projects', item.id, field, value)
  }

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

      <MultilineListField
        label="Project Details (One per line)"
        placeholder="Described what you built and achieved..."
        value={item.bullets}
        onChange={(value) => handleChange('bullets', value)}
      />
    </RepeatableSectionItemShell>
  )
}
