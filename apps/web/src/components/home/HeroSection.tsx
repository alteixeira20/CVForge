'use client'

import { Icon } from '@/components/ui/Icon'

interface HeroSectionProps {
  onCreate?: () => void
}

export function HeroSection({ onCreate = () => {} }: HeroSectionProps) {
  return (
    <>
      <section className="hero container">
        <h1>
          The CV tool that{' '}
          <span className="accent">starts on your machine.</span>
        </h1>
        <p className="lede">
          Forge your CV locally — no account, no sign-up.
          Privacy-first, ATS-friendly, A4/Letter support.
          Everything processed in your browser.
        </p>
        <div className="ctas">
          <button className="btn primary lg" onClick={onCreate}>
            Create CV <Icon name="arrow-right" size={16} stroke="#fff" />
          </button>
          <a className="btn lg" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="github" size={16} /> View on GitHub
          </a>
        </div>
        <div className="meta-row">
          <span><Icon name="lock" size={14} /> No account required</span>
          <span><Icon name="github" size={14} /> Open-source</span>
          <span><Icon name="device" size={14} /> Local processing</span>
          <span><Icon name="shield" size={14} /> MIT licensed</span>
        </div>
      </section>

      <div className="preview-wrap">
        <div className="preview">
          <div className="preview-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="url">cvforge.local · v1.0 Launch</span>
          </div>
          <div className="p-24 flex items-center justify-center h-full text-ink-4">
             [CV Preview Placeholder]
          </div>
        </div>
      </div>
    </>
  )
}
