'use client'

import { useRef, useState } from 'react'

const HOLD_MS = 2000
const TICK_MS = 50

interface HoldDeleteButtonProps {
  onDelete: () => void
}

export function HoldDeleteButton({ onDelete }: HoldDeleteButtonProps) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  const start = () => {
    if (intervalRef.current) return
    elapsedRef.current = 0
    intervalRef.current = setInterval(() => {
      elapsedRef.current += TICK_MS
      const pct = Math.min(elapsedRef.current / HOLD_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        cancel()
        onDelete()
      }
    }, TICK_MS)
  }

  const cancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    elapsedRef.current = 0
    setProgress(0)
  }

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      className="relative overflow-hidden rounded px-3 py-1 text-xs font-medium text-ink border border-border hover:border-ember/60 select-none transition-colors"
      title="Hold to delete"
      style={{
        background: progress > 0
          ? `linear-gradient(to right, rgba(217,116,66,0.25) ${progress * 100}%, transparent ${progress * 100}%)`
          : undefined,
      }}
    >
      <span className="relative z-10">Delete</span>
    </button>
  )
}
