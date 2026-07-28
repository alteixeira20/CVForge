'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from '@/components/ui/Brand'
import { Icon } from '@/components/ui/Icon'

interface SiteHeaderProps {
  onBuilderClick?: () => void
}

export function SiteHeader({ onBuilderClick }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="site-header-inner">
        <Brand href="/" />

        <nav aria-label="Main navigation">
          <Link
            href="/builder"
            className={`nav-link ${pathname === '/builder' ? 'active' : ''}`}
            aria-current={pathname === '/builder' ? 'page' : undefined}
          >
            Builder
          </Link>
          <Link
            href="/analyzer"
            className={`nav-link ${pathname === '/analyzer' ? 'active' : ''}`}
            aria-current={pathname === '/analyzer' ? 'page' : undefined}
          >
            Analyzer
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
          <a
            href="https://github.com/alteixeira20/CVForge"
            target="_blank"
            rel="noopener noreferrer"
            className="btn sm github-star"
            aria-label="Open GitHub to star the CVForge repository (opens in a new tab)"
            title="Opens GitHub to star the repository"
          >
            <Icon name="github" size={16} />
            <span className="star-label">Star on GitHub</span>
          </a>
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
      </div>
    </header>
  )
}
