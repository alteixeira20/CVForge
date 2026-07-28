'use client'

import Link from 'next/link'
import Image from 'next/image'

interface AppHeaderProps {
  title?: string
}

export function AppHeader({
  title = 'Workbench',
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link href="/" className="brand-mini">
        <span className="brand-logo" aria-hidden="true">
          <Image
            src="/brand/anvilary-logo-mark-tight-white.png"
            alt=""
            width={24}
            height={28}
          />
        </span>
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
      </div>
    </header>
  )
}