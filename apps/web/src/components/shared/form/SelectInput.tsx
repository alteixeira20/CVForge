'use client'

import { type SelectHTMLAttributes } from 'react'

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[]
  className?: string
}

export function SelectInput({ options, className = '', ...props }: SelectInputProps) {
  return (
    <select
      className={`w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-sm text-ink outline-none focus-visible:outline-none focus:border-ember focus:ring-[3px] focus:ring-lava-glow transition-[border-color,box-shadow] appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
