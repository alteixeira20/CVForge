import { useState, useRef, useCallback, useEffect } from 'react'
import { type RenderedPage } from './pdfPreviewTypes'

export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.15
// Standard A4 page width in PDF points at scale 1.
// Used to estimate fit zoom before the first render completes.
const PDF_BASE_WIDTH = 595

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

export function useZoomControl(pages: RenderedPage[]) {
  const [zoom, setZoom] = useState(1.0)
  const [fitMode, setFitMode] = useState(true)
  const fitModeRef = useRef(true)
  fitModeRef.current = fitMode
  const pagesRef = useRef<RenderedPage[]>([])
  pagesRef.current = pages
  const containerWidthRef = useRef(0)

  const applyFitZoom = useCallback(() => {
    if (!fitModeRef.current || containerWidthRef.current === 0) return
    const baseWidth = pagesRef.current.length > 0 ? pagesRef.current[0].baseWidth : PDF_BASE_WIDTH
    setZoom(clamp(containerWidthRef.current / baseWidth, MIN_ZOOM, MAX_ZOOM))
  }, [])

  useEffect(() => { applyFitZoom() }, [pages, applyFitZoom])

  const reportContainerWidth = useCallback((w: number) => {
    containerWidthRef.current = w
    applyFitZoom()
  }, [applyFitZoom])

  const zoomOut = () => { setFitMode(false); setZoom(z => clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)) }
  const zoomIn = () => { setFitMode(false); setZoom(z => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)) }
  const fit = () => {
    setFitMode(true)
    if (pagesRef.current.length > 0 && containerWidthRef.current > 0) {
      setZoom(clamp(containerWidthRef.current / pagesRef.current[0].baseWidth, MIN_ZOOM, MAX_ZOOM))
    }
  }

  return { zoom, fitMode, fitModeRef, zoomOut, zoomIn, fit, reportContainerWidth }
}
