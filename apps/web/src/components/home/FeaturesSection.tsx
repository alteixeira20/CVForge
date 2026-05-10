'use client'

import { Icon } from '@/components/ui/Icon'

export function FeaturesSection() {
  return (
    <section className="section container" id="features">
      <div className="section-head">
        <h2>Real CVForge features, kept local.</h2>
        <p className="section-lede">
          Everything here is part of the browser app today: structured editing,
          local persistence, portable exports, and best-effort PDF diagnostics.
        </p>
      </div>
      <div className="features">
        <div className="feature">
          <div className="ic"><Icon name="users" size={20} /></div>
          <h3>Structured CV Builder</h3>
          <p>
            Edit profile, experience, education, projects, skills,
            languages, and custom sections with focused forms.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="device" size={20} /></div>
          <h3>Local Browser Storage</h3>
          <p>
            CV data is stored in browser localStorage. There is no
            account system, backend CV storage, or user database.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="download" size={20} /></div>
          <h3>PDF Export</h3>
          <p>
            Generate a PDF from the current builder state with the
            selected document size, section order, and visibility.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="export" size={20} /></div>
          <h3>JSON Backup and Import</h3>
          <p>
            Export a validated JSON backup and import it later to
            replace the current local builder session.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="file-text" size={20} /></div>
          <h3>CVForge PDF Session Restore</h3>
          <p>
            CVForge PDFs can include an embedded session attachment.
            Upload one in Parser to restore the builder state.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="search" size={20} /></div>
          <h3>Parser Diagnostics</h3>
          <p>
            Upload a PDF locally to inspect extracted text, page count,
            parser confidence, and rule-based diagnostic signals.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="import" size={20} /></div>
          <h3>Best-Effort External Draft Import</h3>
          <p>
            External PDFs can create an editable draft when text is
            readable, but every imported field must be reviewed.
          </p>
        </div>
        <div className="feature">
          <div className="ic"><Icon name="eye" size={20} /></div>
          <h3>Section Controls</h3>
          <p>
            Reorder major sections, hide sections, and control bullet
            visibility before previewing or exporting.
          </p>
        </div>
      </div>
      <div className="gh-cta">
        <div className="gh-cta-text">
          <strong>Local diagnostics are rule-based checks, not hiring guarantees.</strong>
          <span>JSON is the simplest reliable restore path · External PDF import is best-effort</span>
        </div>
      </div>
    </section>
  )
}
