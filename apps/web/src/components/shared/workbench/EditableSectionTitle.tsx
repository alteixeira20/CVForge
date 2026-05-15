'use client'

import { useState, useRef, useEffect } from 'react'

const MAX_LENGTH = 200

interface EditableSectionTitleProps {
  value: string
  onSave: (value: string) => void
}

export function EditableSectionTitle({ value, onSave }: EditableSectionTitleProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [showMaxHit, setShowMaxHit] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const maxHitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = () => {
    onSave(draft.trim() || value)
    setEditing(false)
    setShowMaxHit(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
    setShowMaxHit(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    if (next.length > MAX_LENGTH) {
      setShowMaxHit(true)
      if (maxHitTimerRef.current) clearTimeout(maxHitTimerRef.current)
      maxHitTimerRef.current = setTimeout(() => setShowMaxHit(false), 2000)
      return
    }
    setDraft(next)
    setShowMaxHit(false)
  }

  if (editing) {
    const inputWidth = `${Math.max(draft.length + 2, 8)}ch`
    return (
      <span className="relative inline-flex flex-col">
        <input
          ref={inputRef}
          value={draft}
          onChange={handleChange}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            if (e.key === 'Escape') { e.preventDefault(); cancel() }
          }}
          onClick={(e) => e.stopPropagation()}
          maxLength={MAX_LENGTH}
          className="bg-transparent border-b border-ember outline-none px-2 text-[14px]"
          style={{ width: inputWidth }}
        />
        {showMaxHit && (
          <span className="absolute top-full left-0 mt-1 text-[10px] text-ember whitespace-nowrap pointer-events-none">
            Max {MAX_LENGTH} characters
          </span>
        )}
      </span>
    )
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true) }}
      title="Click to rename"
      className="cursor-text truncate hover:opacity-75 transition-opacity text-[14px]"
    >
      {value}
    </span>
  )
}
