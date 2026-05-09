import { AppHeader } from '@/components/layout/AppHeader'
import { ImportExportActions } from '@/features/import-export/ImportExportActions'

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

        <div className="mt-32 max-w-2xl">
          <ImportExportActions />
        </div>
      </main>
    </div>
  )
}
