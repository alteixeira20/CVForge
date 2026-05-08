import { AppHeader } from '@/components/layout/AppHeader'

export default function BuilderPage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace">
        <header className="workspace-head">
          <div className="crumbline">Workbench / Builder</div>
          <h1>CV Builder</h1>
          <p className="muted">Polished placeholder for the CV building experience.</p>
        </header>
        
        <div className="panel p-12 bg-bg-2 border border-border rounded-lg text-center">
          <p className="ink-2 mb-8">The builder workbench will allow you to edit your CV sections with live PDF preview.</p>
          <div className="flex justify-center gap-12">
            <div className="h-40 w-full max-w-sm bg-bg-3 border border-border-strong rounded animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
