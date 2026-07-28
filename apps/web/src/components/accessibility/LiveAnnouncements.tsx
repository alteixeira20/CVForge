'use client'

import { useEffect, useState } from 'react'
import { ANNOUNCEMENT_EVENT } from '@/lib/accessibility/announce'

export function LiveAnnouncements() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAnnouncement = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail)
    }
    window.addEventListener(ANNOUNCEMENT_EVENT, handleAnnouncement)
    return () => window.removeEventListener(ANNOUNCEMENT_EVENT, handleAnnouncement)
  }, [])

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  )
}
