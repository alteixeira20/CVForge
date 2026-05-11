'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState, useMemo } from 'react'
import { type CVState } from '@/types/cv'
import { isEmptyCV } from '@/lib/cvState'
import { Icon } from '@/components/ui/Icon'

const DownloadPdfButton = dynamic(
  () => import('@/features/resume-pdf/DownloadPdfButton').then((module) => module.DownloadPdfButton),
  { ssr: false, loading: () => <span className="btn sm justify-center opacity-60">Preparing PDF</span> },
)

export function BuilderPreviewPanel({ state }: { state: CVState }) {
  const { previewUrl, isGenerating, error } = useDebouncedPdfPreview(state)
  const isEmpty = useMemo(() => isEmptyCV(state), [state])

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="h-full w-full flex-1 canvas">
        {isEmpty && <EmptyPdfPreview />}
        {!isEmpty && !previewUrl && !error && <GeneratingPdfPreview />}
        {!isEmpty && error && !previewUrl && <PreviewError message={error} />}
        {previewUrl && (
          <div className="canvas-frame">
            <iframe
              title="Generated PDF preview"
              src={`${previewUrl}#navpanes=0&view=Fit`}
              className="h-full w-full border-0 bg-white"
            />
          </div>
        )}
      </div>

      {/* Floating Preview Actions (Bottom-Left) */}
      <div className="absolute left-6 bottom-6 z-20 flex items-center gap-2">
        {isGenerating && previewUrl && (
          <div className="bg-bg/60 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg flex items-center gap-3">
            <span className="animate-pulse text-[9px] font-mono font-bold uppercase tracking-widest text-ink-4">
              Syncing
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-bg-2/80 backdrop-blur-sm p-1.5 rounded-xl border border-border shadow-lg">
          <DownloadPdfButton state={state} />
          <Link href="/parser?source=builder" className="btn sm justify-center bg-bg/50 border-border hover:border-border-strong px-3">
            <Icon name="search" size={13} />
            <span className="hidden sm:inline">Analyze</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function useDebouncedPdfPreview(state: CVState) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const urlRef = useRef('')
  const generationRef = useRef(0)
  const isEmpty = isEmptyCV(state)

  useEffect(() => {
    if (isEmpty) {
      generationRef.current += 1
      setIsGenerating(false)
      setError('')
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = ''
        setPreviewUrl('')
      }
      return
    }

    const generationId = generationRef.current + 1
    generationRef.current = generationId
    setIsGenerating(true)
    setError('')

    const timeout = window.setTimeout(async () => {
      try {
        // Dynamic imports to keep initial bundle small
        const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
          import('@react-pdf/renderer'),
          import('@/features/resume-pdf/ResumePdfDocument')
        ])

        const blob = await pdf(<ResumePdfDocument state={state} />).toBlob()
        if (generationRef.current !== generationId) return

        const nextUrl = URL.createObjectURL(blob)
        const previousUrl = urlRef.current
        urlRef.current = nextUrl
        setPreviewUrl(nextUrl)
        if (previousUrl) URL.revokeObjectURL(previousUrl)
      } catch (err) {
        console.error('PDF generation error:', err)
        if (generationRef.current === generationId) {
          setError('PDF preview could not be generated.')
        }
      } finally {
        if (generationRef.current === generationId) {
          setIsGenerating(false)
        }
      }
    }, 800) // Slightly longer debounce for smoother typing feel

    return () => {
      window.clearTimeout(timeout)
    }
  }, [state, isEmpty])

  useEffect(() => {
    return () => {
      generationRef.current += 1
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = ''
      }
    }
  }, [])

  return { previewUrl, isGenerating, error }
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

function GeneratingPdfPreview() {
  return (
    <div className="flex h-full items-center justify-center p-32 text-center">
      <div className="max-w-xs space-y-6">
        <div className="w-48 h-48 rounded-full bg-bg-2 border border-border flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <Icon name="file-text" size={20} className="text-ink-4" />
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-ink">Building PDF</h2>
          <p className="text-xs leading-relaxed text-ink-3">
            Preparing your multi-page layout.
          </p>
        </div>
      </div>
    </div>
  )
}

function PreviewError({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-32 text-center">
      <p className="max-w-xs text-xs leading-relaxed text-red-300 bg-red-500/10 border border-red-500/20 px-12 py-8 rounded-lg">
        {message}
      </p>
    </div>
  )
}

