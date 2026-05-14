'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type CVState } from '@/types/cv'
import { isEmptyCV } from '@/lib/cvState'
import { type RenderedPage, type RenderProgress } from './pdfPreviewTypes'
import { renderPdfPages } from './pdfCanvasRenderer'

const AUTO_UPDATE_DELAY_MS = 400

async function generatePdfBlob(state: CVState): Promise<Blob> {
  const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/features/resume-pdf/ResumePdfDocument'),
  ])
  return pdf(<ResumePdfDocument state={state} />).toBlob()
}

// Round renderScale to 0.1 increments so tiny container resize events
// (1-2px) don't produce a unique signature and trigger a re-render.
function buildSignature(state: CVState, renderScale: number): string {
  const rs = Math.round(renderScale * 10) / 10
  return JSON.stringify({ resume: state.resume, settings: state.settings, rs })
}

export function usePdfCanvasPreview(state: CVState, renderScale: number) {
  const [pages, setPages] = useState<RenderedPage[]>([])
  const [isRendering, setIsRendering] = useState(false)
  const [progress, setProgress] = useState<RenderProgress | null>(null)
  const [error, setError] = useState('')

  const generationRef = useRef(0)
  const lastRenderedSignatureRef = useRef('')
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const renderScaleRef = useRef(renderScale)
  renderScaleRef.current = renderScale

  const renderSignature = useMemo(
    () => buildSignature(state, renderScale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.resume, state.settings, renderScale],
  )

  const isPreviewStale = pages.length > 0 && renderSignature !== lastRenderedSignatureRef.current

  const runGeneration = useCallback(async (genId: number, capturedState: CVState) => {
    const isCancelled = () => generationRef.current !== genId
    const scale = renderScaleRef.current
    const report = (p: RenderProgress) => { if (!isCancelled()) setProgress(p) }

    report({ stage: 'preparing', pagesDone: 0, pagesTotal: 0 })

    try {
      const blob = await generatePdfBlob(capturedState)
      if (isCancelled()) return

      const newPages = await renderPdfPages(blob, scale, isCancelled, report)
      if (newPages === null) return

      lastRenderedSignatureRef.current = buildSignature(capturedState, scale)
      setPages(newPages)
      setError('')
    } catch (err) {
      console.error('PDF canvas render error:', err)
      if (!isCancelled()) setError('PDF preview could not be generated.')
    } finally {
      if (!isCancelled()) {
        setIsRendering(false)
        setProgress(null)
      }
    }
  }, [])

  const scheduleRefresh = useCallback((immediate: boolean) => {
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }
    if (isEmptyCV(stateRef.current)) return
    // renderScale=0 means the preview container has not been measured yet.
    // Skip generation until the correct fit-zoom renderScale is known.
    if (renderScaleRef.current <= 0) return

    generationRef.current += 1
    const genId = generationRef.current
    const capturedState = stateRef.current
    setError('')

    if (immediate) {
      setIsRendering(true)
      void runGeneration(genId, capturedState)
      return
    }

    pendingTimeoutRef.current = setTimeout(() => {
      pendingTimeoutRef.current = null
      setIsRendering(true)
      void runGeneration(genId, capturedState)
    }, AUTO_UPDATE_DELAY_MS)
  }, [runGeneration])

  // Re-render whenever CV content or renderScale (rounded) changes.
  // Immediate on first load; debounced on subsequent changes.
  useEffect(() => {
    if (isEmptyCV(state)) {
      generationRef.current += 1
      if (pendingTimeoutRef.current !== null) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      setIsRendering(false)
      setProgress(null)
      setError('')
      setPages([])
      lastRenderedSignatureRef.current = ''
      return
    }
    scheduleRefresh(!lastRenderedSignatureRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderSignature])

  useEffect(() => {
    return () => {
      generationRef.current += 1
      if (pendingTimeoutRef.current !== null) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
    }
  }, [])

  return { pages, isRendering, isPreviewStale, progress, error }
}
