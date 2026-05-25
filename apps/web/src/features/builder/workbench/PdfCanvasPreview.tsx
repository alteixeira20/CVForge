'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { type RenderedPage, type RenderProgress } from './pdfPreviewTypes'
import { useZoomControl, MIN_ZOOM, MAX_ZOOM, clamp } from './useZoomControl'
import { useDevicePixelRatio } from './useDevicePixelRatio'

const MAX_RENDER_SCALE = 4
const WIDE_SIDE_PADDING = 20
// Max fraction a fit-mode page may exceed the container before switching to
// the blocking loading screen on resize (avoids showing a stretched/wrong-position page).
const OVERFLOW_TOLERANCE = 0.02

// --- Progress helpers (Mode A blocking screen only) ---

function progressPct(p: RenderProgress | null): number {
  if (!p || p.stage === 'preparing') return 20
  const frac = p.pagesTotal > 0 ? p.pagesDone / p.pagesTotal : 0
  return Math.round(25 + frac * 65)
}

function stageLabel(p: RenderProgress | null): string {
  if (!p || p.stage === 'preparing') return 'Preparing document'
  const { pagesDone, pagesTotal } = p
  if (pagesTotal > 1 && pagesDone > 0 && pagesDone < pagesTotal) {
    return `Rendering page ${pagesDone} of ${pagesTotal}`
  }
  return 'Rendering pages'
}

// --- Sub-components ---

function DockSeparator() {
  return <div className="w-px h-4 bg-border mx-0.5 self-center" />
}

interface PreviewDockProps {
  actionSlot: ReactNode
  zoom: number
  fitMode: boolean
  onZoomOut: () => void
  onZoomIn: () => void
  onFit: () => void
}

function PreviewDock({ actionSlot, zoom, fitMode, onZoomOut, onZoomIn, onFit }: PreviewDockProps) {
  return (
    <div className="sticky w-full flex justify-center z-10 pointer-events-none" style={{ bottom: '8px' }}>
      <div className="pointer-events-auto flex items-center gap-1 bg-bg-2/80 backdrop-blur-sm p-1.5 rounded-xl border border-border shadow-lg">
        {actionSlot}
        <DockSeparator />
        <button
          onClick={onZoomOut}
          disabled={zoom <= MIN_ZOOM}
          title="Zoom out"
          aria-label="Zoom out PDF preview"
          className="btn sm bg-bg/50 border-border hover:border-border-strong px-3 font-mono disabled:opacity-40"
        >
          -
        </button>
        <span className="text-[11px] font-mono text-ink-3 min-w-[3.5rem] text-center select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          disabled={zoom >= MAX_ZOOM}
          title="Zoom in"
          aria-label="Zoom in PDF preview"
          className="btn sm bg-bg/50 border-border hover:border-border-strong px-3 font-mono disabled:opacity-40"
        >
          +
        </button>
        <button
          onClick={onFit}
          title="Fit PDF preview"
          aria-label="Fit PDF preview to panel"
          aria-pressed={fitMode}
          className={`btn sm px-3 text-xs bg-bg/50 hover:border-border-strong ${fitMode ? 'border-ember/40 text-ember' : 'border-border'}`}
        >
          Fit
        </button>
      </div>
    </div>
  )
}

// Mode A: blocks display until a valid render is available.
// Shows staged progress so the user knows work is happening.
function BlockingLoadingScreen({ progress }: { progress: RenderProgress | null }) {
  const pct = progressPct(progress)
  const label = stageLabel(progress)
  return (
    <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-6" style={{ width: 200 }}>
        <div className="w-40 h-40 rounded-full bg-bg-2 border border-border flex items-center justify-center shadow-sm">
          <Icon name="file-text" size={18} className="text-ink-4" />
        </div>
        <div className="w-full space-y-2">
          <div className="h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-ember/60 rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-center text-[11px] font-mono text-ink-4">{label}</p>
        </div>
      </div>
    </div>
  )
}

function PreviewError({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-12 text-center">
      <p className="max-w-xs text-xs leading-relaxed text-red-300 bg-red-500/10 border border-red-500/20 px-12 py-8 rounded-lg">
        {message}
      </p>
    </div>
  )
}

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
      {isBlocking && (error ? <PreviewError message={error} /> : <BlockingLoadingScreen progress={progress} />)}
      {!isBlocking && (
        <>
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
          <PreviewDock
            actionSlot={actionSlot}
            zoom={zoom}
            fitMode={fitMode}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onFit={fit}
          />
        </>
      )}
    </div>
  )
}
