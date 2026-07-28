'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface HeroSectionProps {
  onCreateClick?: () => void
}

export function HeroSection({ onCreateClick }: HeroSectionProps) {
  return (
    <section className="hero container" aria-labelledby="home-title">
      <h1 id="home-title">
        Build, analyze, and improve your CV{' '}
        <span className="accent">— locally.</span>
      </h1>
      <p className="lede">
        Create a structured CV with browser autosave, reliable backup, and PDF
        export. Then use transparent ATS-style checks for actionable feedback
        without server-side CV storage.
      </p>
      <div className="ctas">
        <button type="button" onClick={onCreateClick} className="btn primary lg">
          Build your CV <Icon name="arrow-right" size={16} />
        </button>
        <Link href="/analyzer" className="btn lg">
          Analyze CV <Icon name="search" size={16} />
        </Link>
      </div>

      <div className="meta-row" aria-label="CVForge highlights">
        <span><Icon name="lock" size={14} /> No account required</span>
        <span><Icon name="device" size={14} /> Autosaved in this browser</span>
        <span><Icon name="file-text" size={14} /> PDF export</span>
        <span><Icon name="export" size={14} /> Reliable JSON backup</span>
      </div>

      <div className="preview-wrap" aria-hidden="true">
        <div className="preview">
          <div className="preview-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">cvforge.local · Local CV workbench</span>
          </div>
          <div className="product-preview">
            <div className="preview-pane editor-pane">
              <div className="pane-kicker">Builder</div>
              <h2>Complete, structured editing</h2>
              <div className="preview-row active">
                <span>Profile &amp; summary</span>
                <strong>Complete</strong>
              </div>
              <div className="preview-row">
                <span>Experience</span>
                <strong>2 roles</strong>
              </div>
              <div className="preview-row">
                <span>Projects &amp; skills</span>
                <strong>Included</strong>
              </div>
              <div className="preview-row">
                <span>Education &amp; languages</span>
                <strong>Included</strong>
              </div>
              <div className="preview-actions">
                <span><Icon name="download" size={14} /> PDF</span>
                <span><Icon name="export" size={14} /> JSON</span>
              </div>
            </div>
            <div className="preview-pane document-pane" aria-label="CV preview illustration">
              <div className="doc-sheet">
                <div className="doc-name">Maya Chen</div>
                <div className="doc-role">Product Engineer</div>
                <div className="doc-contact">maya.chen@example.com · Lisbon · mayachen.dev · English / Portuguese</div>
                <p className="doc-summary">
                  Product engineer focused on accessible workflow tools and dependable frontend systems.
                </p>
                <div className="doc-section">
                  <span>Experience</span>
                  <strong>Senior Product Engineer · Northstar Works</strong>
                  <p>Led a design-system rollout that cut interface delivery time by 32% across four teams.</p>
                  <strong>Frontend Engineer · Juniper Studio</strong>
                  <p>Improved onboarding completion by 18% through accessible, measured product changes.</p>
                </div>
                <div className="doc-section doc-project">
                  <span>Project</span>
                  <strong>Open Metrics Toolkit</strong>
                  <p>Built a privacy-minded dashboard used in 12 internal product reviews.</p>
                </div>
                <div className="doc-bottom-grid">
                  <div className="doc-section compact">
                    <span>Skills</span>
                    <p>TypeScript · React · Accessibility · Product systems</p>
                  </div>
                  <div className="doc-section compact">
                    <span>Education</span>
                    <p>BSc Computer Science · 2018</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-pane parser-pane">
              <div className="pane-kicker">Analyzer</div>
              <h2>Actionable CV insights</h2>
              <div className="analyzer-score">
                <div className="score-ring">84</div>
                <div>
                  <strong>Overall signal</strong>
                  <span>Solid foundation</span>
                </div>
              </div>
              <div className="insight-row"><span>Extraction quality</span><strong>Strong</strong></div>
              <div className="insight-row"><span>Structure completeness</span><strong>92</strong></div>
              <div className="insight-row"><span>Contact details</span><strong>Detected</strong></div>
              <div className="insight-row"><span>Experience</span><strong>2 roles</strong></div>
              <div className="insight-row"><span>Skills</span><strong>Detected</strong></div>
              <div className="preview-priority">
                <span>Improve first</span>
                <p>Add measurable outcomes to one remaining task-focused bullet.</p>
              </div>
            </div>

            <div className="mobile-preview">
              <div className="mobile-preview-card">
                <div className="pane-kicker">Builder preview</div>
                <strong>Maya Chen · Product Engineer</strong>
                <p>Summary · 2 experience roles · Project · Skills · Education · Languages</p>
              </div>
              <div className="mobile-preview-card">
                <div className="pane-kicker">Analyzer insights</div>
                <div className="mobile-score-row"><strong>84 / 100</strong><span>Solid foundation</span></div>
                <p>Extraction strong · Structure 92 · Contact, experience, and skills detected</p>
                <span className="mobile-priority">Improve first: quantify one more outcome</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
