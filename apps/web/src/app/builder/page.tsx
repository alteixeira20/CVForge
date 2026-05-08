'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { useCV } from '@/context/CVContext'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { Icon } from '@/components/ui/Icon'

export default function BuilderPage() {
  const { state } = useCV()
  const { resume, settings } = state
  const { profile, workExperience, education } = resume

  const leftPanel = (
    <div className="p-24 lg:p-40 space-y-48 pb-80">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Builder</div>
        <h1>CV Builder</h1>
        <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
      </header>

      <section className="space-y-24">
        <div className="flex items-center gap-8 border-b border-border-faint pb-8">
          <Icon name="users" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink-4 font-bold">Personal Profile</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <ProfileEditor />
        </div>
      </section>

      <section className="space-y-24">
        <div className="flex items-center gap-8 border-b border-border-faint pb-8">
          <Icon name="activity" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink-4 font-bold">Experience</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <WorkExperienceEditor />
        </div>
      </section>

      <section className="space-y-24">
        <div className="flex items-center gap-8 border-b border-border-faint pb-8">
          <Icon name="fold" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink-4 font-bold">Education</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <EducationEditor />
        </div>
      </section>

      <section className="space-y-24">
        <div className="flex items-center gap-8 border-b border-border-faint pb-8">
          <Icon name="sun" size={14} className="text-ember" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink-4 font-bold">Builder Settings</h3>
        </div>
        <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
          <SettingsEditor />
        </div>
      </section>

      <div className="space-y-12 opacity-50">
        <h3 className="text-[10px] uppercase tracking-widest text-ink-4 font-bold">More Sections Coming Soon</h3>
        <div className="grid grid-cols-2 gap-12">
          {['Projects', 'Skills', 'Languages'].map((section) => (
            <div key={section} className="panel p-12 bg-bg-2 border border-border rounded-lg flex items-center justify-between">
              <span className="text-xs font-medium">{section}</span>
              <span className="text-[8px] bg-bg-3 border border-border-strong px-4 py-1 rounded text-ink-4 uppercase">Planned</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const rightPanel = (
    <div className="h-full flex flex-col items-center justify-start py-80 px-40">
      <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col text-[#1a1a1a]">
        <div className="h-6 w-full" style={{ backgroundColor: settings.themeColor }} />
        
        <div className="p-40 flex-1 flex flex-col gap-24 overflow-hidden text-left" style={{ fontFamily: settings.fontFamily }}>
          {/* Header */}
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

          {/* Summary */}
          {profile.summary && (
            <div style={{ marginTop: settings.profileSpacing }}>
              <h3 className="font-bold border-b border-gray-200 pb-2 uppercase tracking-wider" style={{ fontSize: settings.sectionHeadingSize }}>Professional Summary</h3>
              <p className="leading-relaxed text-gray-700 whitespace-pre-wrap mt-8" style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}>{profile.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div style={{ marginTop: settings.sectionSpacing }}>
              <h3 className="font-bold border-b border-gray-200 pb-2 uppercase tracking-wider" style={{ fontSize: settings.sectionHeadingSize }}>Work Experience</h3>
              <div className="mt-12 space-y-16">
                {workExperience.map((item) => (
                  <div key={item.id} className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900" style={{ fontSize: settings.fontSize }}>{item.company || 'Company'}</span>
                      <span className="text-gray-500 italic" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>{item.startDate} — {item.isCurrent ? 'Present' : item.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-700 italic" style={{ fontSize: Math.max(9, settings.fontSize - 1) }}>{item.role || 'Role'}</span>
                      <span className="text-gray-500" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>{item.location}</span>
                    </div>
                    {item.bullets.length > 0 && (
                      <ul className="list-disc pl-16 space-y-2 mt-4">
                        {item.bullets.filter(b => b.trim()).map((bullet, i) => (
                          <li key={i} className="text-gray-700" style={{ fontSize: Math.max(8, settings.fontSize - 1), lineHeight: settings.lineHeight }}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginTop: settings.sectionSpacing }}>
              <h3 className="font-bold border-b border-gray-200 pb-2 uppercase tracking-wider" style={{ fontSize: settings.sectionHeadingSize }}>Education</h3>
              <div className="mt-12 space-y-12">
                {education.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900" style={{ fontSize: settings.fontSize }}>{item.school || 'Institution'}</span>
                      <span className="text-gray-500 italic" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>{item.startDate} — {item.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-700" style={{ fontSize: Math.max(9, settings.fontSize - 1) }}>{item.degree || 'Degree'}</span>
                      <span className="text-gray-500" style={{ fontSize: Math.max(8, settings.fontSize - 1) }}>{item.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto p-20 border-t border-gray-50 flex justify-between items-center grayscale opacity-50 select-none">
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
