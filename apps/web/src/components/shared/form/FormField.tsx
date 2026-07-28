'use client'

import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react'
import { FieldLabel } from './FieldLabel'

interface FormFieldProps {
  label: string
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function FormField({ label, children, htmlFor, required, className = '' }: FormFieldProps) {
  const generatedId = useId()
  let control = children
  let controlId = htmlFor ?? generatedId

  if (isValidElement(children)) {
    const child = children as ReactElement<{ id?: string; required?: boolean }>
    controlId = htmlFor ?? child.props.id ?? generatedId
    control = cloneElement(child, {
      id: controlId,
      required: child.props.required ?? required,
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <FieldLabel htmlFor={controlId} required={required}>
        {label}
      </FieldLabel>
      {control}
    </div>
  )
}
