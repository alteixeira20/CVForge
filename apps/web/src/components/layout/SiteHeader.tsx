'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brand } from '@/components/ui/Brand'
import { Icon } from '@/components/ui/Icon'

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
      
      <span className="spacer" />
      
      <div className="actions">
        {onBuilderClick ? (
          <button 
            type="button"
            className="nav-link"
            onClick={onBuilderClick}
          >
            Builder
          </button>
        ) : (
          <Link href="/builder" className="nav-link">
            Builder
          </Link>
        )}
        
        <Link href="/parser" className="nav-link">
          Parser
        </Link>
        
        <a 
          href="https://github.com/alteixeira20/CVForge" 
          target="_blank" 
          rel="noreferrer"
          className="btn sm bg-bg shadow-sm ml-4 site-github-action"
        >
          <Icon name="github" size={14} />
          <span>Star</span>
        </a>
      </div>
    </header>
  )
}
