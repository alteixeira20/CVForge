import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ParserWorkbench } from '@/features/parser/workbench/ParserWorkbench'
import { ANALYZER_DESCRIPTION, ANALYZER_TITLE } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: {
    absolute: ANALYZER_TITLE,
  },
  description: ANALYZER_DESCRIPTION,
  alternates: {
    canonical: '/analyzer',
  },
  openGraph: {
    type: 'website',
    url: '/analyzer',
    siteName: 'CVForge',
    title: ANALYZER_TITLE,
    description: ANALYZER_DESCRIPTION,
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'CVForge: build and analyze your CV locally',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ANALYZER_TITLE,
    description: ANALYZER_DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<AnalyzerLoadingFallback />}>
      <ParserWorkbench />
    </Suspense>
  )
}

function AnalyzerLoadingFallback() {
  return (
    <main className="app-shell">
      <div className="flex h-full items-center justify-center p-8 text-center" role="status" aria-live="polite">
        <div className="space-y-3">
          <h1 className="text-sm font-medium text-ink">Loading CV analysis</h1>
          <p className="text-xs text-ink-3">Preparing the local Analyzer workbench.</p>
        </div>
      </div>
    </main>
  )
}
