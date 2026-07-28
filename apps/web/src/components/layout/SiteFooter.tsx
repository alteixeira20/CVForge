'use client'

import { Brand } from '@/components/ui/Brand'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="row">
        <Brand />
        <span className="dot" aria-hidden="true">·</span>
        <span>
          Part of{' '}
          <a href="https://anvilary.tools" target="_blank" rel="noopener noreferrer">
            Anvilary Tools
          </a>
        </span>
        <span className="flex-1" />
        <span>No account or backend CV storage.</span>
      </div>
      <div className="row sub">
        <a href="https://anvilary.tools" target="_blank" rel="noopener noreferrer">
          anvilary.tools
        </a>
        <a
          href="https://github.com/alteixeira20/CVForge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
        <span className="flex-1" />
        <span>CV data stays in your browser localStorage; JSON export is the reliable backup path.</span>
      </div>
    </footer>
  )
}