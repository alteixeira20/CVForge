'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { type CVState } from '@/types/cv'
import { isEmptyCV } from '@/lib/cvState'
import { unsupportedCharactersInCV } from '@/lib/pdfCharacterSupport'
import { Icon } from '@/components/ui/Icon'
import { PreviewCanvas } from '@/components/shared/workbench/PreviewCanvas'
import { PdfCanvasPreview } from './PdfCanvasPreview'
import { usePdfCanvasPreview } from './usePdfCanvasPreview'
import { PreviewLoadingState } from './PreviewLoadingState'
import { useCV } from '@/context/CVContext'

const DownloadPdfButton = dynamic(
  () => import('@/features/resume-pdf/DownloadPdfButton').then((m) => m.DownloadPdfButton),
  { ssr: false, loading: () => <span className="btn sm justify-center opacity-60" aria-live="polite">Preparing PDF</span> },
)

const PAGE_WIDTH_POINTS = { A4: 595.28, Letter: 612 } as const

export function BuilderPreviewPanel({ state }: { state: CVState }) {
  const { persistence } = useCV()
  const [renderScale, setRenderScale] = useState(0)
  const preview = usePdfCanvasPreview(state, renderScale)
  const isEmpty = isEmptyCV(state)
  const isLoadingSavedCV = persistence.status === 'loading'
  const hasPages = preview.pages.length > 0

  const actionSlot = (
    <>
      <DownloadPdfButton state={state} />
      <Link
        href="/analyzer?source=builder"
        className="btn sm justify-center bg-bg/50 border-border hover:border-border-strong px-3"
      >
        <Icon name="search" size={13} />
        <span className="hidden sm:inline">Analyze</span>
        <span className="sr-only sm:hidden">Analyze</span>
      </Link>
    </>
  )

  return (
    <div className="relative flex h-full w-full flex-col">
      {!isEmpty && <PdfCharacterNotice state={state} />}
      <div className="relative min-h-0 flex-1">
        <PreviewCanvas>
          {isLoadingSavedCV && <PreviewLoadingState progress={null} />}
          {!isLoadingSavedCV && isEmpty && <EmptyPdfPreview />}
          {!isLoadingSavedCV && !isEmpty && (
            <PdfCanvasPreview
              pages={preview.pages}
              error={preview.error}
              progress={preview.progress}
              fallbackBaseWidth={PAGE_WIDTH_POINTS[state.settings.documentSize]}
              actionSlot={actionSlot}
              onRetry={preview.retry}
              onRenderScaleChange={setRenderScale}
            />
          )}
        </PreviewCanvas>
        {!isEmpty && hasPages && (
          <PreviewStatus
            isUpdating={preview.isPending || preview.isRendering}
            error={preview.error}
            onRetry={preview.retry}
          />
        )}
      </div>
    </div>
  )
}

// The PDF uses standard fonts (no embedded font files), which cover Western
// European text only. Other characters would appear garbled, so say so.
function PdfCharacterNotice({ state }: { state: CVState }) {
  const unsupported = useMemo(() => unsupportedCharactersInCV(state), [state])
  if (unsupported.length === 0) return null

  return (
    <div className="pdf-character-notice" role="status" aria-live="polite">
      <strong>Some characters cannot be shown in the PDF:</strong>{' '}
      <span className="pdf-character-list" lang="und">{unsupported.join(' ')}</span>
      <span className="block">
        The PDF uses standard fonts that support Western European languages only. These
        characters appear incorrectly in the preview and the downloaded file.
      </span>
    </div>
  )
}

// Non-blocking status shown over existing pages. The current pages stay
// visible while an update is pending, rendering, or has failed.
function PreviewStatus({ isUpdating, error, onRetry }: {
  isUpdating: boolean
  error: string
  onRetry: () => void
}) {
  return (
    <div className="preview-status">
      <div role="status" aria-live="polite" aria-atomic="true">
        {error && <span className="preview-status-chip preview-status-error">Preview could not be updated</span>}
        {!error && isUpdating && <span className="preview-status-chip">Updating preview</span>}
      </div>
      {error && (
        <button type="button" className="btn sm preview-status-retry" onClick={onRetry}>
          Retry preview
        </button>
      )}
    </div>
  )
}

function EmptyPdfPreview() {
  return (
    <div className="flex h-full items-center justify-center bg-bg-inset p-6 text-center sm:p-10 lg:p-32">
      <div className="max-w-xs space-y-4 sm:space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-bg-2 shadow-sm sm:h-36 sm:w-36 lg:h-48 lg:w-48">
          <Icon name="file-text" size={20} className="text-ink-4" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-sm font-semibold text-ink">No PDF preview yet</h2>
          <p className="text-xs leading-relaxed text-ink-3">
            Add profile details or an experience entry to generate the real-time PDF preview.
          </p>
        </div>
      </div>
    </div>
  )
}
