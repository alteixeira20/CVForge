'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface HeroSectionProps {
  onCreateClick?: () => void
}

export function HeroSection({ onCreateClick }: HeroSectionProps) {
  return (
    <section className="hero container">
      <h1>
        The CV tool that{' '}
        <span className="accent">starts on your machine.</span>
      </h1>
      <p className="lede">
        Build a structured CV in your browser, export PDF or JSON,
        and inspect uploaded PDFs with local rule-based diagnostics.
        No account, no database, no server-side CV storage.
      </p>
      <div className="ctas">
        <button type="button" onClick={onCreateClick} className="btn primary lg">
          Create CV <Icon name="plus" size={16} />
        </button>
        <Link href="/parser" className="btn lg">
          Analyze PDF <Icon name="file-text" size={16} />
        </Link>
      </div>

      <div className="preview-wrap">
        <div className="preview">
          <div className="preview-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">cvforge.local · Local CV workbench</span>
          </div>
          <div className="product-preview">
            <div className="preview-pane editor-pane">
              <div className="pane-kicker">Builder</div>
              <h2>Structured CV editing</h2>
              <div className="preview-row active">
                <span>Profile</span>
                <strong>Saved locally</strong>
              </div>
              <div className="preview-row">
                <span>Experience</span>
                <strong>Visible</strong>
              </div>
              <div className="preview-row">
                <span>Projects</span>
                <strong>Moved up</strong>
              </div>
              <div className="preview-actions">
                <span><Icon name="download" size={14} /> PDF</span>
                <span><Icon name="export" size={14} /> JSON</span>
              </div>
            </div>
            <div className="preview-pane document-pane" aria-label="CV preview illustration">
              <div className="doc-sheet">
                <div className="doc-name">Alex Morgan</div>
                <div className="doc-contact">alex@example.com · Lisbon · portfolio.dev</div>
                <div className="doc-section">
                  <span>Experience</span>
                  <p>Led delivery of measurable product improvements.</p>
                  <p>Reduced manual reporting time with workflow automation.</p>
                </div>
                <div className="doc-section compact">
                  <span>Skills</span>
                  <p>TypeScript · React · Product Systems</p>
                </div>
              </div>
            </div>
            <div className="preview-pane parser-pane">
              <div className="pane-kicker">Parser</div>
              <h2>Local PDF diagnostics</h2>
              <div className="score-ring">82</div>
              <p>Rule-based checks for selectable text, visible links, compactness, and draft import confidence.</p>
              <span className="best-effort">External PDFs require review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="meta-row" aria-label="CVForge highlights">
        <span><Icon name="lock" size={14} /> No account required</span>
        <span><Icon name="device" size={14} /> Browser localStorage</span>
        <span><Icon name="file-text" size={14} /> PDF and JSON export</span>
        <span><Icon name="search" size={14} /> Heuristic diagnostics</span>
      </div>
    </section>
  )
}
