'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CONFIRM_DELETE_TIMEOUT_MS,
  getDeleteButtonAriaLabel,
} from './confirmDeleteHelpers'

export interface ConfirmDeleteButtonProps {
  onDelete: () => void
  itemLabel?: string
}

export function ConfirmDeleteButton({ onDelete, itemLabel }: ConfirmDeleteButtonProps) {
  const [isArmed, setIsArmed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const disarm = () => {
    clearTimer()
    setIsArmed(false)
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  const handleClick = () => {
    if (!isArmed) {
      setIsArmed(true)
      clearTimer()
      timerRef.current = setTimeout(() => {
        setIsArmed(false)
        timerRef.current = null
      }, CONFIRM_DELETE_TIMEOUT_MS)
    } else {
      clearTimer()
      setIsArmed(false)
      onDelete()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && isArmed) {
      event.preventDefault()
      event.stopPropagation()
      disarm()
    }
  }

  const ariaLabel = getDeleteButtonAriaLabel(isArmed, itemLabel)

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isArmed}
      title={isArmed ? 'Confirm deletion' : 'Delete item'}
      className={`rounded px-3 py-1 text-xs font-medium select-none transition-colors focus-visible:outline-none focus-visible:ring-1 ${
        isArmed
          ? 'border border-[#7c2114] text-white bg-gradient-to-b from-[#b03a2a] to-[#7c2114] hover:border-[#b03a2a] shadow-sm focus-visible:ring-red-400'
          : 'border border-border text-ink hover:border-ember/60 hover:text-ink bg-transparent focus-visible:ring-ember'
      }`}
    >
      {isArmed ? 'Confirm delete' : 'Delete'}
    </button>
  )
}
