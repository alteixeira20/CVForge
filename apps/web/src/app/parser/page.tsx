import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ParserWorkbench } from '@/features/parser/workbench/ParserWorkbench'

export const metadata: Metadata = {
  title: 'Parser',
  description: 'Review PDF extraction and local rule-based CV diagnostics in your browser.',
}

export default function ParserPage() {
  return (
    <Suspense fallback={<ParserLoadingFallback />}>
      <ParserWorkbench />
    </Suspense>
  )
}

function ParserLoadingFallback() {
  return (
    <div className="app-shell">
      <div className="flex h-full items-center justify-center p-8 text-center" role="status" aria-live="polite">
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink">Loading parser diagnostics</p>
          <p className="text-xs text-ink-3">Preparing the local PDF workbench.</p>
        </div>
      </div>
    </div>
  )
}
