import { Icon, type IconName } from '@/components/ui/Icon'

const FEATURES: Array<{
  description: string
  icon: IconName
  title: string
}> = [
  {
    icon: 'users',
    title: 'Structured CV Builder',
    description:
      'Use the free browser-based Builder to edit major CV sections, reorder content, control visibility, and preview the document.',
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
    title: 'ATS-style CV Analyzer',
    description:
      'Check PDF extraction, structure, completeness, clarity, and impact with transparent local rules and practical suggestions.',
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
        <h2>Practical tools for a CV you can keep improving.</h2>
        <p className="section-lede">
          Build a complete CV or resume, keep a dependable structured backup,
          and use honest local analysis to decide what to improve next.
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
    </section>
  )
}
