'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useCV } from '@/context/CVContext'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'

export default function BuilderPage() {
  const { state, updateProfileField } = useCV()

  const leftPanel = (
    <div className="p-24 lg:p-40 space-y-32">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Builder</div>
        <h1>CV Builder</h1>
        <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
      </header>

      <section className="space-y-16">
        <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold">Profile</h3>
        <div className="panel p-20 bg-bg-2 border border-border rounded-xl">
          <label className="block text-xs text-ink-3 mb-6 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name..."
            className="w-full bg-bg-inset border border-border rounded-lg p-12 text-ink focus:border-ember outline-none transition-colors"
            value={state.resume.profile.name}
            onChange={(e) => updateProfileField('name', e.target.value)}
          />
        </div>
      </section>

      <div className="space-y-12">
        <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold opacity-50">Coming Soon</h3>
        {['Experience', 'Education', 'Projects', 'Skills', 'Languages', 'Settings'].map((section) => (
          <div key={section} className="panel p-16 bg-bg-2 border border-border rounded-xl opacity-40 grayscale flex items-center justify-between">
            <span className="text-sm font-medium">{section}</span>
            <span className="text-[10px] bg-bg-3 border border-border-strong px-6 py-2 rounded text-ink-4 uppercase">Planned</span>
          </div>
        ))}
      </div>
    </div>
  )

  const rightPanel = (
    <div className="h-full flex flex-col items-center justify-center p-40">
      <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col">
        <div className="h-4 bg-ember w-full" />
        <div className="p-40 flex-1 flex flex-col gap-24">
          <div className="h-32 bg-gray-100 rounded w-1/2" />
          <div className="space-y-8">
            <div className="h-12 bg-gray-50 rounded w-full" />
            <div className="h-12 bg-gray-50 rounded w-full" />
            <div className="h-12 bg-gray-50 rounded w-3/4" />
          </div>
          <div className="mt-auto p-20 border-t border-gray-50 flex justify-between items-center grayscale opacity-50">
             <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">CVForge Preview Placeholder</span>
             <span className="text-[10px] text-gray-400 font-mono">A4 Portrait</span>
          </div>
        </div>
      </div>
      <p className="mt-24 text-xs text-ink-4 font-mono uppercase tracking-widest">Live PDF Preview (Prototype)</p>
    </div>
  )

  return (
    <div className="app-shell">
      <AppHeader title={state.resume.profile.name || 'Untitled CV'} />
      <WorkbenchShell 
        leftPanel={leftPanel} 
        rightPanel={rightPanel} 
        leftLabel="Edit"
        rightLabel="Preview"
      />
    </div>
  )
}
