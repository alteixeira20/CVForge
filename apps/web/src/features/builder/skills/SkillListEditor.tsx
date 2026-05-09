import { FormField } from '@/components/shared/form/FormField'
import { TextArea } from '@/components/shared/form/TextArea'
import { linesToSkills } from './skillsText'

interface SkillListEditorProps {
  label: string
  placeholder: string
  value: string[]
  onChange: (value: string[]) => void
}

export function SkillListEditor({ label, placeholder, value, onChange }: SkillListEditorProps) {
  return (
    <FormField label={label}>
      <TextArea
        placeholder={placeholder}
        value={value.join('\n')}
        onChange={(event) => onChange(linesToSkills(event.target.value))}
      />
    </FormField>
  )
}
