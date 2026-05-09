import { FormField } from './FormField'
import { TextArea } from './TextArea'

interface MultilineListFieldProps {
  label: string
  placeholder: string
  value: string[]
  onChange: (value: string[]) => void
}

export function MultilineListField({ label, placeholder, value, onChange }: MultilineListFieldProps) {
  return (
    <FormField label={label}>
      <TextArea
        placeholder={placeholder}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
      />
    </FormField>
  )
}
