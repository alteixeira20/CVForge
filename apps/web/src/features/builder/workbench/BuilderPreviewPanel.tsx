import { type CVState } from '@/types/cv'
import { PreviewDocument } from '@/features/builder/preview/PreviewDocument'

export function BuilderPreviewPanel({ state }: { state: CVState }) {
  const { settings } = state

  return (
    <div className="h-full flex flex-col items-center justify-start py-80 px-40">
      <PreviewDocument state={state} />
      <div className="mt-24 flex flex-col items-center gap-4">
        <p className="text-[10px] text-ink-4 font-mono uppercase tracking-[0.2em]">
          Live Dynamic Preview
        </p>
        <p className="text-[9px] text-ink-4 opacity-50 font-mono italic">
          {settings.fontSize}pt / {settings.lineHeight}lh / {settings.sectionSpacing}px gap
        </p>
      </div>
    </div>
  )
}
