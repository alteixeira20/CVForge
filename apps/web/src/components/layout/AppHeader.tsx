'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface AppHeaderProps {
  title?: string
}

export function AppHeader({
  title = 'Workbench',
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link href="/" className="brand-mini" style={{ cursor: 'pointer', textDecoration: 'none' }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: 'linear-gradient(180deg, #2a2018, #161114)',
            border: '1px solid var(--border-strong)',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 110%, var(--molten), transparent 60%)',
              opacity: 0.95,
            }}
          />
          <Icon name="anvil" size={13} stroke="#f5853f" strokeWidth={1.7} />
        </div>
        <span>CVForge</span>
      </Link>

      <div className="crumbs">
        <span>CVForge</span>
        <span className="sep">/</span>
        <span className="active">{title}</span>
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
