import { Icon } from '@/components/ui/Icon'

export function HowItWorksSection() {
  return (
    <section className="section container" id="how">
      <div className="section-head">
        <h2>A local workflow from editing to review.</h2>
        <p className="section-lede">
          CVForge separates reliable structured editing from best-effort
          PDF parsing, so the app is clear about what it can restore.
        </p>
      </div>
      <div className="flow-strip" aria-hidden="true">
        <span>Build Locally</span>
        <span className="flow-sep">→</span>
        <span>Export PDF or JSON</span>
        <span className="flow-sep">→</span>
        <span>Analyze PDF</span>
        <span className="flow-sep">→</span>
        <span>Restore or Draft</span>
      </div>
      <div className="steps">
        <div className="step-card">
          <div className="step-ic"><Icon name="device" size={17} /></div>
          <span className="num">STEP 01</span>
          <h3>Build your CV locally.</h3>
          <p>
            Use the Builder to edit structured CV sections. Changes are
            saved in your browser localStorage, without an account.
          </p>
        </div>
        <div className="step-card">
          <div className="step-ic"><Icon name="download" size={17} /></div>
          <span className="num">STEP 02</span>
          <h3>Export PDF or JSON.</h3>
          <p>
            Download a PDF for sharing or a JSON backup for the most
            reliable full-session restore path.
          </p>
        </div>
        <div className="step-card">
          <div className="step-ic"><Icon name="search" size={17} /></div>
          <span className="num">STEP 03</span>
          <h3>Analyze a PDF locally.</h3>
          <p>
            Upload a PDF in Parser to inspect selectable text and
            local heuristic diagnostics. No server upload is required.
          </p>
        </div>
        <div className="step-card">
          <div className="step-ic"><Icon name="import" size={17} /></div>
          <span className="num">STEP 04</span>
          <h3>Restore or create a draft.</h3>
          <p>
            CVForge PDFs can restore embedded sessions. External PDFs
            can only create best-effort drafts that need review.
          </p>
        </div>
      </div>
    </section>
  )
}
