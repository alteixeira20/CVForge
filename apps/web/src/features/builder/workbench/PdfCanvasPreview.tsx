'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { type RenderedPage, type RenderProgress } from './pdfPreviewTypes'
import { useZoomControl, MIN_ZOOM, MAX_ZOOM, clamp } from './useZoomControl'
import { useDevicePixelRatio } from './useDevicePixelRatio'
import { PreviewDock } from './PreviewDock'
import { PreviewErrorState } from './PreviewErrorState'
import { PreviewLoadingState } from './PreviewLoadingState'

const MAX_RENDER_SCALE = 4
const WIDE_SIDE_PADDING = 20
// Max fraction a fit-mode page may exceed the container before switching to
// the blocking loading screen on resize (avoids showing a stretched/wrong-position page).
const OVERFLOW_TOLERANCE = 0.02

// --- Main component ---

interface PdfCanvasPreviewProps {
  pages: RenderedPage[]
  error: string
  progress: RenderProgress | null
  actionSlot: ReactNode
  onRenderScaleChange: (scale: number) => void
}

export function PdfCanvasPreview({
  pages,
  error,
  progress,
  actionSlot,
  onRenderScaleChange,
}: PdfCanvasPreviewProps) {
  const { zoom, fitMode, fitModeRef, zoomOut, zoomIn, fit, reportContainerWidth } = useZoomControl(pages)
  const [containerWidth, setContainerWidth] = useState(0)
  const dpr = useDevicePixelRatio()
  const [renderedZoom, setRenderedZoom] = useState(0)
  // fitMode captured when the current pages were rendered.
  // Distinguishes intentional overflow (user zoomed in) from unintended overflow (container shrank).
  const fitModeAtRenderRef = useRef(true)

  const renderScale = containerWidth > 0 ? Math.min(zoom * dpr, MAX_RENDER_SCALE) : 0
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const hasPages = pages.length > 0

  // Single stable observer on one persistent div — no hasPages dep.
  // Eliminates the DOM-swap measurement gap that caused first-load wrong-position renders.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const report = () => {
      const w = el.offsetWidth
      setContainerWidth(w)
      reportContainerWidth(w)
    }
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [reportContainerWidth])

  useEffect(() => {
    onRenderScaleChange(renderScale)
  }, [renderScale, onRenderScaleChange])

  // useLayoutEffect: fires before paint so renderedZoom is already correct when the
  // browser commits the frame — no extra paint cycle with a stale zoom value.
  // dpr intentionally excluded: keeping stale renderedZoom until new pages arrive is correct.
  useLayoutEffect(() => {
    if (pages.length === 0) { setRenderedZoom(0); return }
    fitModeAtRenderRef.current = fitModeRef.current
    const rz = pages[0].canvas.width / (pages[0].baseWidth * dpr)
    setRenderedZoom(clamp(rz, MIN_ZOOM, MAX_ZOOM))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages])

  // useLayoutEffect: canvas pixels must be written before the browser paints to avoid blank frames.
  useLayoutEffect(() => {
    canvasRefs.current.length = pages.length
    pages.forEach((page, i) => {
      const el = canvasRefs.current[i]
      if (!el) return
      if (el.width !== page.canvas.width) el.width = page.canvas.width
      if (el.height !== page.canvas.height) el.height = page.canvas.height
      const ctx = el.getContext('2d')
      if (ctx) ctx.drawImage(page.canvas, 0, 0)
    })
  }, [pages])

  const displayZoom = renderedZoom > 0 ? renderedZoom : zoom
  const visualPageWidth = hasPages ? pages[0].baseWidth * displayZoom : 0
  const pagesOverflow = containerWidth > 0 && hasPages && visualPageWidth > containerWidth * (1 + OVERFLOW_TOLERANCE)
  const overflowIsUnintended = pagesOverflow && fitModeAtRenderRef.current

  // Mode A: blocking — no valid pages yet, or current pages are layout-invalid (resize overflow).
  // Mode B: background — valid pages shown, new render happening silently in the hook.
  const isBlocking = !hasPages || overflowIsUnintended
  const isWider = !isBlocking && containerWidth > 0 && visualPageWidth > containerWidth

  return (
    <div ref={containerRef} className={isBlocking ? 'w-full h-full' : 'w-full'}>
      {isBlocking && (error ? <PreviewErrorState message={error} /> : <PreviewLoadingState progress={progress} />)}
      {!isBlocking && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '76px',
            alignItems: isWider ? 'flex-start' : 'center',
            paddingLeft: isWider ? WIDE_SIDE_PADDING : 0,
            paddingRight: isWider ? WIDE_SIDE_PADDING : 0,
          }}
        >
          {pages.map((page, i) => (
            <div
              key={i}
              className="bg-white border border-border shadow-lg rounded-sm overflow-hidden flex-shrink-0"
              style={{ width: page.baseWidth * displayZoom, height: page.baseHeight * displayZoom }}
            >
              <canvas
                ref={(el) => { canvasRefs.current[i] = el }}
                style={{ width: page.baseWidth * displayZoom, height: page.baseHeight * displayZoom, display: 'block' }}
              />
            </div>
          ))}
        </div>
      )}
      {hasPages && (
        <PreviewDock
          actionSlot={actionSlot}
          zoom={zoom}
          fitMode={fitMode}
          onZoomOut={zoomOut}
          onZoomIn={zoomIn}
          onFit={fit}
        />
      )}
    </div>
  )
}
