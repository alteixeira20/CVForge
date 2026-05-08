'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useCV } from '@/context/CVContext'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { Icon } from '@/components/ui/Icon'

export default function BuilderPage() {
  const { state } = useCV()
  const { profile } = state.resume

  const leftPanel = (
    <div className="p-24 lg:p-40 space-y-32 pb-80">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Builder</div>
        <h1>CV Builder</h1>
        <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
      </header>

      <section className="space-y-16">
        <div className="flex items-center gap-8 mb-4">
          <Icon name="users" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold">Personal Profile</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <ProfileEditor />
        </div>
      </section>

      <div className="space-y-12">
        <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold opacity-50">Additional Sections</h3>
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
      <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col text-[#1a1a1a]">
        <div className="h-4 bg-ember w-full" />
        
        {/* Simplified PDF Preview Content */}
        <div className="p-40 flex-1 flex flex-col gap-24 overflow-hidden text-left">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight uppercase">{profile.name || 'Your Name'}</h2>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-medium text-gray-600">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.location && <span>{profile.location}</span>}
              {profile.website && <span>{profile.website}</span>}
              {profile.github && <span>{profile.github}</span>}
              {profile.linkedin && <span>{profile.linkedin}</span>}
            </div>
          </div>

          {profile.summary && (
            <div className="space-y-8">
              <h3 className="text-xs font-bold border-b border-gray-200 pb-2 uppercase tracking-wider">Professional Summary</h3>
              <p className="text-[10px] leading-relaxed text-gray-700 whitespace-pre-wrap">{profile.summary}</p>
            </div>
          )}

          <div className="space-y-12 opacity-20 grayscale select-none">
            <div className="h-px bg-gray-200 w-full" />
            <div className="h-20 bg-gray-100 rounded w-1/3" />
            <div className="space-y-4">
               <div className="h-10 bg-gray-50 rounded w-full" />
               <div className="h-10 bg-gray-50 rounded w-full" />
            </div>
          </div>
          
          <div className="mt-auto p-20 border-t border-gray-50 flex justify-between items-center grayscale opacity-50">
             <span className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter italic">Clean-Room Build Prototype</span>
             <span className="text-[9px] text-gray-400 font-mono">{state.settings.documentSize} {state.settings.localePreset}</span>
          </div>
        </div>
      </div>
      <p className="mt-24 text-xs text-ink-4 font-mono uppercase tracking-widest">Live Dynamic Preview</p>
    </div>
  )

  return (
    <div className="app-shell">
      <AppHeader title={profile.name || 'Untitled CV'} />
      <WorkbenchShell 
        leftPanel={leftPanel} 
        rightPanel={rightPanel} 
        leftLabel="Edit"
        rightLabel="Preview"
      />
    </div>
  )
}
