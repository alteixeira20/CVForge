'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brand } from '@/components/ui/Brand'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <Brand href="/" />
      <nav>
        <Link href="/builder">Builder</Link>
        <Link href="/parser">Parser</Link>
      </nav>
      <span className="spacer" />
      <div className="actions">
        <Link href="/builder" className="btn primary">
          Create CV
        </Link>
      </div>
    </header>
  )
}
