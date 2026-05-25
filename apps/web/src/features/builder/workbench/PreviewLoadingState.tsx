import { Icon } from '@/components/ui/Icon'
import { type RenderProgress } from './pdfPreviewTypes'
import { progressPct, stageLabel } from './previewProgress'

// Mode A: blocks display until a valid render is available.
// Shows staged progress so the user knows work is happening.
export function PreviewLoadingState({ progress }: { progress: RenderProgress | null }) {
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
