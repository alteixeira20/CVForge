import { Icon } from '@/components/ui/Icon'

export function HowItWorksSection() {
  return (
    <section className="section container" id="how">
      <div className="section-head">
        <h2>Build first, then improve with clear signals.</h2>
        <p className="section-lede">
          CVForge keeps structured editing and best-effort document extraction
          distinct, so every restore and analysis path stays understandable.
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
            <h3>Analyze or restore locally.</h3>
          </div>
          <p>
            Analyzer checks a readable PDF for extraction, structure, and CV
            improvement signals. External PDF drafts always require review.
          </p>
        </div>
      </div>
    </section>
  )
}
