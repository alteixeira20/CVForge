'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableSectionTitleProps {
  value: string
  onSave: (value: string) => void
}

export function EditableSectionTitle({ value, onSave }: EditableSectionTitleProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = () => {
    onSave(draft.trim() || value)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') { e.preventDefault(); cancel() }
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-transparent border-b border-ember outline-none w-[160px] max-w-full"
      />
    )
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true) }}
      title="Click to rename"
      className="cursor-text truncate hover:opacity-75 transition-opacity"
    >
      {value}
    </span>
  )
}
