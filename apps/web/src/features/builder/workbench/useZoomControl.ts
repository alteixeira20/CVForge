import { useState, useRef, useCallback, useEffect } from 'react'
import { type RenderedPage } from './pdfPreviewTypes'

// Bounds for the manual zoom buttons.
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 2.5
// Fit may go below the manual minimum so a page always fits narrow panels.
const MIN_FIT_ZOOM = 0.2
const ZOOM_STEP = 0.15

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

function fitZoomFor(containerWidth: number, baseWidth: number) {
  return clamp(containerWidth / baseWidth, MIN_FIT_ZOOM, MAX_ZOOM)
}

// fallbackBaseWidth is the page width in PDF points for the selected document
// size, used to fit correctly before the first render arrives.
export function useZoomControl(pages: RenderedPage[], fallbackBaseWidth: number) {
  const [zoom, setZoom] = useState(1.0)
  const [fitMode, setFitMode] = useState(true)
  const fitModeRef = useRef(true)
  fitModeRef.current = fitMode
  const baseWidth = pages.length > 0 ? pages[0].baseWidth : fallbackBaseWidth
  const baseWidthRef = useRef(baseWidth)
  baseWidthRef.current = baseWidth
  const containerWidthRef = useRef(0)

  const applyFitZoom = useCallback(() => {
    if (!fitModeRef.current || containerWidthRef.current === 0) return
    setZoom(fitZoomFor(containerWidthRef.current, baseWidthRef.current))
  }, [])

  useEffect(() => { applyFitZoom() }, [baseWidth, applyFitZoom])

  const reportContainerWidth = useCallback((w: number) => {
    containerWidthRef.current = w
    applyFitZoom()
  }, [applyFitZoom])

  const zoomOut = () => { setFitMode(false); setZoom(z => clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)) }
  const zoomIn = () => { setFitMode(false); setZoom(z => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)) }
  const fit = () => {
    setFitMode(true)
    fitModeRef.current = true
    applyFitZoom()
  }

  return { zoom, fitMode, zoomOut, zoomIn, fit, reportContainerWidth }
}
