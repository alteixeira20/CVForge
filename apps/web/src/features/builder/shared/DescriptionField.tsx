'use client'

import { MultilineListField } from '@/components/shared/form/MultilineListField'
import { DescriptionFormatToggle } from '@/components/shared/form/DescriptionFormatToggle'
import { type DescriptionMode } from '@/types/cv'

interface DescriptionFieldProps {
  label: string
  placeholder: string
  value: string[]
  mode: DescriptionMode
  onChange: (value: string[]) => void
  onToggleMode: () => void
}

export function DescriptionField({
  label,
  placeholder,
  value,
  mode,
  onChange,
  onToggleMode,
}: DescriptionFieldProps) {
  return (
    <MultilineListField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      action={<DescriptionFormatToggle mode={mode} onToggle={onToggleMode} />}
    />
  )
}
