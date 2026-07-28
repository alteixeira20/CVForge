'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brand } from '@/components/ui/Brand'

interface SiteHeaderProps {
  onBuilderClick?: () => void
}

export function SiteHeader({ onBuilderClick }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <Brand href="/" />

      <nav aria-label="Main">
        <Link href="/parser" className="nav-link">
          Parser
        </Link>

        <a
          href="https://github.com/alteixeira20/CVForge"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link nav-source"
        >
          Source
        </a>
      </nav>

      <span className="spacer" />

      <div className="actions">
        {onBuilderClick ? (
          <button type="button" className="btn primary sm" onClick={onBuilderClick}>
            <span className="build-label-full">Build your CV</span>
            <span className="build-label-compact">Build CV</span>
          </button>
        ) : (
          <Link href="/builder" className="btn primary sm">
            <span className="build-label-full">Build your CV</span>
            <span className="build-label-compact">Build CV</span>
          </Link>
        )}
      </div>
    </header>
  )
}
