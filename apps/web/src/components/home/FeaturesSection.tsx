import { Icon, type IconName } from '@/components/ui/Icon'

const FEATURES: Array<{
  description: string
  icon: IconName
  title: string
}> = [
  {
    icon: 'users',
    title: 'Structured building and preview',
    description:
      'Edit every major CV section, reorder content, control visibility, and preview the generated document as you work.',
  },
  {
    icon: 'device',
    title: 'Private browser autosave',
    description:
      'Your current CV stays in this browser. There is no account, user database, or server-side CV storage.',
  },
  {
    icon: 'export',
    title: 'Reliable JSON backup',
    description:
      'Export validated structured data for the simplest reliable backup and full-session restore path.',
  },
  {
    icon: 'download',
    title: 'PDF export with session restore',
    description:
      'Download a polished PDF. CVForge-generated files can also carry an embedded session for later restoration.',
  },
  {
    icon: 'search',
    title: 'Transparent PDF diagnostics',
    description:
      'Inspect selectable text, extraction quality, and local rule-based checks without sending the PDF to a server.',
  },
  {
    icon: 'import',
    title: 'Review-first external import',
    description:
      'Turn a readable external PDF into a best-effort draft only after reviewing what CVForge could extract.',
  },
]

export function FeaturesSection() {
  return (
    <section className="section container" id="features">
      <div className="section-head">
        <h2>Everything needed to build, back up, and review.</h2>
        <p className="section-lede">
          CVForge keeps reliable structured data separate from best-effort PDF
          extraction, so every action is clear about what it preserves.
        </p>
      </div>
      <div className="features">
        {FEATURES.map((feature) => (
          <article className="feature" key={feature.title}>
            <div className="feature-head">
              <div className="ic"><Icon name={feature.icon} size={20} /></div>
              <h3>{feature.title}</h3>
            </div>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
      <div className="gh-cta">
        <div className="gh-cta-text">
          <strong>Diagnostics are practical signals, not hiring guarantees.</strong>
          <span>JSON is reliable · CVForge PDFs may restore · External PDFs require review</span>
        </div>
      </div>
    </section>
  )
}
