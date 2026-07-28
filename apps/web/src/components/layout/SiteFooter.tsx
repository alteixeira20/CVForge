import { Brand } from '@/components/ui/Brand'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="row">
        <Brand />
        <span className="footer-family" aria-label="Anvilary Labs, Anvilary Tools, CVForge">
          <span>Anvilary Labs</span>
          <span aria-hidden="true">→</span>
          <a href="https://anvilary.tools" target="_blank" rel="noopener noreferrer">
            Anvilary Tools
          </a>
          <span aria-hidden="true">→</span>
          <strong>CVForge</strong>
        </span>
        <span className="flex-1" />
        <a
          href="https://github.com/alteixeira20/CVForge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <div className="row sub">
        <span>
          CV data stays in this browser. Export JSON for the most reliable backup.
        </span>
        <span className="flex-1" />
        <span>No account or server-side CV storage.</span>
      </div>
    </footer>
  )
}
