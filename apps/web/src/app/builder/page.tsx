'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useCV } from '@/context/CVContext'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { Icon } from '@/components/ui/Icon'

export default function BuilderPage() {
  const { state } = useCV()
  const { resume, settings } = state
  const { profile } = resume

  const leftPanel = (
    <div className="p-24 lg:p-40 space-y-40 pb-80">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Builder</div>
        <h1>CV Builder</h1>
        <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
      </header>

      <section className="space-y-16">
        <div className="flex items-center gap-8">
          <Icon name="users" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold">Personal Profile</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <ProfileEditor />
        </div>
      </section>

      <section className="space-y-16">
        <div className="flex items-center gap-8">
          <Icon name="sun" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold">Builder Settings</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <SettingsEditor />
        </div>
      </section>

      <div className="space-y-12">
        <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold opacity-50">Additional Sections</h3>
        {['Experience', 'Education', 'Projects', 'Skills', 'Languages'].map((section) => (
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
        <div className="h-6 w-full" style={{ backgroundColor: settings.themeColor }} />
        
        {/* Simplified PDF Preview Content */}
        <div className="p-40 flex-1 flex flex-col gap-24 overflow-hidden text-left" style={{ fontFamily: settings.fontFamily }}>
          <div className="space-y-4 text-center">
            <h2 className="font-bold tracking-tight uppercase" style={{ fontSize: settings.nameFontSize }}>{profile.name || 'Your Name'}</h2>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 font-medium text-gray-600" style={{ fontSize: Math.max(9, settings.fontSize - 2) }}>
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.location && <span>{profile.location}</span>}
              {profile.website && <span>{profile.website}</span>}
              {profile.github && <span>{profile.github}</span>}
              {profile.linkedin && <span>{profile.linkedin}</span>}
            </div>
          </div>

          {profile.summary && (
            <div style={{ marginTop: settings.profileSpacing }}>
              <h3 className="font-bold border-b border-gray-200 pb-2 uppercase tracking-wider" style={{ fontSize: settings.sectionHeadingSize }}>Professional Summary</h3>
              <p className="leading-relaxed text-gray-700 whitespace-pre-wrap mt-8" style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}>{profile.summary}</p>
            </div>
          )}

          <div className="space-y-12 opacity-10 grayscale select-none mt-20">
            <div className="h-px bg-gray-200 w-full" />
            <div className="h-16 bg-gray-100 rounded w-1/3" />
            <div className="space-y-4">
               <div className="h-8 bg-gray-50 rounded w-full" />
               <div className="h-8 bg-gray-50 rounded w-full" />
            </div>
          </div>
          
          <div className="mt-auto p-20 border-t border-gray-50 flex justify-between items-center grayscale opacity-50">
             <span className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter italic">Clean-Room Build Prototype</span>
             <div className="flex gap-8 text-[9px] text-gray-400 font-mono uppercase">
               <span>{settings.documentSize}</span>
               <span>•</span>
               <span>{settings.localePreset}</span>
             </div>
          </div>
        </div>
      </div>
      <div className="mt-24 flex flex-col items-center gap-4">
        <p className="text-[10px] text-ink-4 font-mono uppercase tracking-[0.2em]">Live Dynamic Preview</p>
        <p className="text-[9px] text-ink-4 opacity-50 font-mono italic">
          {settings.fontSize}pt / {settings.lineHeight}lh / {settings.sectionSpacing}px gap
        </p>
      </div>
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
