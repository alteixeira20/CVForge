'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { type RenderedPage, type RenderProgress } from './pdfPreviewTypes'
import { useZoomControl } from './useZoomControl'
import { useDevicePixelRatio } from './useDevicePixelRatio'
import { PreviewDock } from './PreviewDock'
import { PreviewErrorState } from './PreviewErrorState'
import { PreviewLoadingState } from './PreviewLoadingState'

const MAX_RENDER_SCALE = 4
const WIDE_SIDE_PADDING = 20

interface PdfCanvasPreviewProps {
  pages: RenderedPage[]
  error: string
  progress: RenderProgress | null
  fallbackBaseWidth: number
  actionSlot: ReactNode
  onRetry: () => void
  onRenderScaleChange: (scale: number) => void
}

// Pages are always displayed at the current zoom. When the zoom or the panel
// width changes, the existing bitmaps are scaled with CSS until sharper pages
// arrive, so valid pages are never replaced by the loading state.
export function PdfCanvasPreview({
  pages,
  error,
  progress,
  fallbackBaseWidth,
  actionSlot,
  onRetry,
  onRenderScaleChange,
}: PdfCanvasPreviewProps) {
  const { zoom, fitMode, zoomOut, zoomIn, fit, reportContainerWidth } = useZoomControl(pages, fallbackBaseWidth)
  const containerWidth = useContainerWidth(reportContainerWidth)
  const dpr = useDevicePixelRatio()
  const containerRef = containerWidth.ref
  const hasPages = pages.length > 0

  // A hidden panel measures 0 px; a zero scale pauses rendering.
  const renderScale = containerWidth.value > 0 ? Math.min(zoom * dpr, MAX_RENDER_SCALE) : 0

  useEffect(() => {
    onRenderScaleChange(renderScale)
  }, [renderScale, onRenderScaleChange])

  const visualPageWidth = hasPages ? pages[0].baseWidth * zoom : 0
  // Sub-pixel tolerance: at Fit, width * zoom can exceed the container by a
  // rounding error, which must not switch to the wide (scrolling) layout.
  const isWider = hasPages && containerWidth.value > 0 && visualPageWidth > containerWidth.value + 0.5

  return (
    <div ref={containerRef} className={hasPages ? 'w-full min-w-0' : 'w-full min-w-0 h-full'}>
      {!hasPages && (error
        ? <PreviewErrorState message={error} onRetry={onRetry} />
        : <PreviewLoadingState progress={progress} />)}
      {hasPages && (
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
            <PreviewPage key={i} page={page} zoom={zoom} />
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

function useContainerWidth(onWidth: (width: number) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const report = () => {
      const width = el.offsetWidth
      setValue(width)
      onWidth(width)
    }
    report()
    const observer = new ResizeObserver(report)
    observer.observe(el)
    return () => observer.disconnect()
  }, [onWidth])

  return { ref, value }
}

function PreviewPage({ page, zoom }: { page: RenderedPage, zoom: number }) {
  // A callback ref paints whenever a canvas element attaches or the page
  // bitmap changes, so a remounted canvas is never left blank.
  const paint = useCallback((el: HTMLCanvasElement | null) => {
    if (el) copyBitmap(el, page.canvas)
  }, [page])
  const width = page.baseWidth * zoom
  const height = page.baseHeight * zoom

  return (
    <div
      className="bg-white border border-border shadow-lg rounded-sm overflow-hidden flex-shrink-0"
      style={{ width, height }}
      data-preview-page
    >
      <canvas ref={paint} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

function copyBitmap(target: HTMLCanvasElement, source: HTMLCanvasElement) {
  if (target.width !== source.width) target.width = source.width
  if (target.height !== source.height) target.height = source.height
  const ctx = target.getContext('2d')
  if (ctx) ctx.drawImage(source, 0, 0)
}
