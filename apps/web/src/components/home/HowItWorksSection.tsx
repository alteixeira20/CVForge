import { Icon } from '@/components/ui/Icon'

export function HowItWorksSection() {
  return (
    <section className="section container" id="how">
      <div className="section-head">
        <h2>A local workflow from editing to review.</h2>
        <p className="section-lede">
          CVForge separates reliable structured editing from best-effort
          PDF review, so you always know what can be restored exactly.
        </p>
      </div>
      <div className="steps">
        <div className="step-card">
          <span className="num">STEP 01</span>
          <div className="step-head">
            <div className="step-ic"><Icon name="device" size={17} /></div>
            <h3>Build your CV locally.</h3>
          </div>
          <p>
            Edit structured sections with a live PDF preview. Changes are
            autosaved in this browser without an account.
          </p>
        </div>
        <div className="step-card">
          <span className="num">STEP 02</span>
          <div className="step-head">
            <div className="step-ic"><Icon name="download" size={17} /></div>
            <h3>Export PDF or JSON.</h3>
          </div>
          <p>
            Download a PDF for sharing and keep a JSON backup when you
            need the most reliable full-session restore path.
          </p>
        </div>
        <div className="step-card">
          <span className="num">STEP 03</span>
          <div className="step-head">
            <div className="step-ic"><Icon name="search" size={17} /></div>
            <h3>Review or restore locally.</h3>
          </div>
          <p>
            Parser can restore embedded CVForge sessions or create a
            review-first draft from a readable external PDF.
          </p>
        </div>
      </div>
    </section>
  )
}
