'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { BrandMark } from '@/components/ui/BrandMark'

interface AppHeaderProps {
  title?: string
}

export function AppHeader({
  title = 'Workbench',
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link href="/" className="brand-mini" style={{ cursor: 'pointer', textDecoration: 'none' }}>
        <BrandMark variant="tight" style={{ width: '34px' }} />
        <span>CVForge</span>
      </Link>

      <div className="crumbs">
        <span>CVForge</span>
        <span className="sep">/</span>
        <span className="active" title={title}>{title}</span>
      </div>

      <span className="badge">
        <span className="dot" />
        LOCAL ONLY
      </span>

      <span className="spacer" />

      <div className="actions">
        <Link href="/builder" className="btn sm">
          Builder
        </Link>
        <Link href="/parser" className="btn sm">
          Parser
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
