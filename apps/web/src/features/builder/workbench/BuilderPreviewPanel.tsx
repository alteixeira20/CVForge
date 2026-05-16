'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { type CVState } from '@/types/cv'
import { isEmptyCV } from '@/lib/cvState'
import { Icon } from '@/components/ui/Icon'
import { PreviewCanvas } from '@/components/shared/workbench/PreviewCanvas'
import { PdfCanvasPreview } from './PdfCanvasPreview'
import { usePdfCanvasPreview } from './usePdfCanvasPreview'

const DownloadPdfButton = dynamic(
  () => import('@/features/resume-pdf/DownloadPdfButton').then((m) => m.DownloadPdfButton),
  { ssr: false, loading: () => <span className="btn sm justify-center opacity-60">Preparing PDF</span> },
)

const SPIN_VISIBLE_MS = 600

export function BuilderPreviewPanel({ state }: { state: CVState }) {
  const [renderScale, setRenderScale] = useState(0)
  const { pages, progress, error } = usePdfCanvasPreview(state, renderScale)
  const isEmpty = isEmptyCV(state)

  // One-shot spin: each successful page swap increments spinKey (remounts the SVG,
  // restarting the animation) and keeps the icon visible for SPIN_VISIBLE_MS.
  const [spinKey, setSpinKey] = useState(0)
  const [showSpin, setShowSpin] = useState(false)
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pages.length === 0) return
    if (spinTimerRef.current !== null) clearTimeout(spinTimerRef.current)
    setSpinKey(k => k + 1)
    setShowSpin(true)
    spinTimerRef.current = setTimeout(() => setShowSpin(false), SPIN_VISIBLE_MS)
  }, [pages])

  useEffect(() => () => {
    if (spinTimerRef.current !== null) clearTimeout(spinTimerRef.current)
  }, [])

  const actionSlot = (
    <>
      <DownloadPdfButton state={state} />
      <Link
        href="/parser?source=builder"
        className="btn sm justify-center bg-bg/50 border-border hover:border-border-strong px-3"
      >
        <Icon name="search" size={13} />
        <span className="hidden sm:inline">Analyze</span>
      </Link>
    </>
  )

  return (
    <div className="relative h-full w-full">
      <PreviewCanvas>
        {isEmpty && <EmptyPdfPreview />}
        {!isEmpty && (
          <PdfCanvasPreview
            pages={pages}
            error={error}
            progress={progress}
            actionSlot={actionSlot}
            onRenderScaleChange={setRenderScale}
          />
        )}
      </PreviewCanvas>
      {!isEmpty && showSpin && <SpinIcon spinKey={spinKey} />}
    </div>
  )
}

// Appears for SPIN_VISIBLE_MS after each valid render lands. No text, no labels.
// key={spinKey} remounts the SVG each time so the animation restarts cleanly.
function SpinIcon({ spinKey }: { spinKey: number }) {
  return (
    <div className="absolute top-3 right-3 z-20 pointer-events-none">
      <svg
        key={spinKey}
        className="animate-spin text-ink-4/50"
        style={{
          animationIterationCount: 1,
          animationDuration: '550ms',
          animationTimingFunction: 'ease-in-out',
        }}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
        <path
          d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function EmptyPdfPreview() {
  return (
    <div className="flex h-full items-center justify-center p-32 text-center bg-bg-inset">
      <div className="max-w-xs space-y-6">
        <div className="w-48 h-48 rounded-full bg-bg-2 border border-border flex items-center justify-center mx-auto shadow-sm">
          <Icon name="file-text" size={20} className="text-ink-4" />
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-ink">No PDF preview yet</h2>
          <p className="text-xs leading-relaxed text-ink-3">
            Add profile details or an experience entry to generate the real-time PDF preview.
          </p>
        </div>
      </div>
    </div>
  )
}
