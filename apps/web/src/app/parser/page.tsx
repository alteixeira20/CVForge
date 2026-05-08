import { AppHeader } from '@/components/layout/AppHeader'

export default function ParserPage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace">
        <header className="workspace-head">
          <div className="crumbline">Workbench / Parser</div>
          <h1>Parser Diagnostics</h1>
          <p className="muted">Polished placeholder for the ATS parser workbench.</p>
        </header>

        <div className="panel p-12 bg-bg-2 border border-border rounded-lg">
          <div className="flex flex-col gap-12 items-center text-center">
            <div className="w-16 h-16 rounded-full bg-lava-glow flex items-center justify-center border border-ember-2">
              <div className="w-8 h-8 rounded-full bg-ember animate-ping"></div>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4">ATS Scoring & Diagnostics</h3>
              <p className="ink-2 max-w-md">Upload a PDF to inspect how it would be parsed by ATS systems and get a scoring breakdown.</p>
            </div>
            <button className="btn primary">Upload PDF to Parse</button>
          </div>
        </div>
      </main>
    </div>
  )
}
