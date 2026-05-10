'use client'

import { Brand } from '@/components/ui/Brand'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="row">
        <Brand />
        <span style={{ color: 'var(--ink-4)' }}>·</span>
        <span>Local-first CV builder and parser</span>
        <span className="flex-1" />
        <span>No account or backend CV storage.</span>
      </div>
      <div className="row sub" style={{ marginTop: 16, color: 'var(--ink-4)', fontSize: 13 }}>
        <span>CVForge stores CV data in your browser localStorage.</span>
        <span className="flex-1" />
        <span>Use JSON export for the simplest reliable backup and restore path.</span>
      </div>
    </footer>
  )
}
