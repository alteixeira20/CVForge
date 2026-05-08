'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { Icon } from '@/components/ui/Icon'

export default function ParserPage() {
  const leftPanel = (
    <div className="p-24 lg:p-40 space-y-32">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Parser</div>
        <h1>Parser Diagnostics</h1>
        <p className="muted text-sm">Upload a PDF to analyze its ATS compatibility and parsing accuracy.</p>
      </header>

      <section className="space-y-16">
        <div className="panel p-32 bg-bg-2 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center group hover:border-ember transition-colors cursor-pointer">
          <div className="w-48 h-48 rounded-full bg-bg-3 border border-border-strong flex items-center justify-center mb-16 group-hover:scale-110 transition-transform">
             <Icon name="import" size={20} />
          </div>
          <h3 className="font-medium text-ink">Drop your PDF here</h3>
          <p className="text-xs text-ink-3 mt-4">or click to browse your files</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-16">
        <div className="panel p-20 bg-bg-2 border border-border rounded-xl opacity-50 grayscale flex items-center gap-16">
           <div className="w-10 h-10 rounded-full bg-border-strong" />
           <div className="flex-1 space-y-4">
             <div className="h-10 bg-bg-3 rounded w-1/4" />
             <div className="h-8 bg-bg-3 rounded w-3/4" />
           </div>
        </div>
        <div className="panel p-20 bg-bg-2 border border-border rounded-xl opacity-50 grayscale flex items-center gap-16">
           <div className="w-10 h-10 rounded-full bg-border-strong" />
           <div className="flex-1 space-y-4">
             <div className="h-10 bg-bg-3 rounded w-1/4" />
             <div className="h-8 bg-bg-3 rounded w-3/4" />
           </div>
        </div>
      </div>

      <p className="text-[10px] text-ink-4 uppercase tracking-[0.2em] text-center font-mono">Heuristic Engine Offline</p>
    </div>
  )

  const rightPanel = (
    <div className="h-full flex flex-col items-center justify-center p-40 opacity-40 grayscale">
      <div className="w-full h-full border border-border-strong bg-bg-inset rounded-lg flex flex-col items-center justify-center text-center p-40">
        <Icon name="device" size={40} strokeWidth={1} className="mb-20 text-ink-4" />
        <h2 className="text-xl font-light text-ink-3">Source Viewer</h2>
        <p className="text-sm text-ink-4 mt-8 max-w-xs">Upload a file to see the side-by-side comparison between raw PDF and extracted text.</p>
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <AppHeader title="Parser Diagnostics" />
      <WorkbenchShell 
        leftPanel={leftPanel} 
        rightPanel={rightPanel} 
        leftLabel="Analysis"
        rightLabel="Source"
      />
    </div>
  )
}
