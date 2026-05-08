import { AppHeader } from '@/components/layout/AppHeader'

export default function ImportPage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace">
        <header className="workspace-head">
          <div className="crumbline">Foundation / Session</div>
          <h1>Resume Import</h1>
          <p className="muted">Restore a previous session or import from external sources.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32">
          <div className="panel p-24 bg-bg-2 border border-border rounded-xl hover:border-ember transition-colors cursor-pointer group">
            <h3 className="text-lg font-medium mb-8 group-hover:text-ember transition-colors">Start Fresh</h3>
            <p className="ink-3 text-sm leading-relaxed">Begin with a clean template and enter your details manually.</p>
          </div>
          <div className="panel p-24 bg-bg-2 border border-border rounded-xl hover:border-ember transition-colors cursor-pointer group">
            <h3 className="text-lg font-medium mb-8 group-hover:text-ember transition-colors">Import PDF</h3>
            <p className="ink-3 text-sm leading-relaxed">Auto-fill your CV by parsing an existing PDF file locally.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
