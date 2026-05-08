'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useCV } from '@/context/CVContext'

export default function BuilderPage() {
  const { state, updateProfileField } = useCV()

  return (
    <div className="app-shell">
      <AppHeader title={state.resume.profile.name || 'Untitled CV'} />
      <main className="workspace">
        <header className="workspace-head">
          <div className="crumbline">Workbench / Builder</div>
          <h1>CV Builder</h1>
          <p className="muted">Polished placeholder for the CV building experience.</p>
        </header>
        
        <div className="panel p-12 bg-bg-2 border border-border rounded-lg text-center">
          <p className="ink-2 mb-8">The builder workbench will allow you to edit your CV sections with live PDF preview.</p>
          
          <div className="flex flex-col items-center gap-12">
            <div className="w-full max-w-sm">
              <input 
                type="text" 
                placeholder="Enter your name to test state..."
                className="w-full p-12 rounded bg-bg-3 border border-border text-center"
                value={state.resume.profile.name}
                onChange={(e) => updateProfileField('name', e.target.value)}
              />
              <p className="mt-8 text-sm text-ink-3">Last updated: {new Date(state.updatedAt).toLocaleTimeString()}</p>
            </div>
            <div className="h-40 w-full max-w-sm bg-bg-3 border border-border-strong rounded animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
