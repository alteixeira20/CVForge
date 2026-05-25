import { type ReactNode } from 'react'
import { MIN_ZOOM, MAX_ZOOM } from './useZoomControl'

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

export function PreviewDock({ actionSlot, zoom, fitMode, onZoomOut, onZoomIn, onFit }: PreviewDockProps) {
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
