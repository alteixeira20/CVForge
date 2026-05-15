import { type ReactNode } from 'react'
import { FieldLabel } from './FieldLabel'
import { TextArea } from './TextArea'

interface MultilineListFieldProps {
  label: string
  placeholder: string
  value: string[]
  onChange: (value: string[]) => void
  action?: ReactNode
}

export function MultilineListField({ label, placeholder, value, onChange, action }: MultilineListFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        {action}
      </div>
      <TextArea
        placeholder={placeholder}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
      />
    </div>
  )
}
