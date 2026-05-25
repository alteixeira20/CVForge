import { Icon } from '@/components/ui/Icon'
import { PreviewCanvas } from '@/components/shared/workbench/PreviewCanvas'
import { type ParserDocument } from '../upload/parserTypes'

export function SourcePdfPreview({ document }: { document: ParserDocument | null }) {
  if (!document?.objectUrl) return <EmptySourcePreview />

  const floatingActions = (
    <div className="bg-bg-2/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-lg">
      <p className="text-[10px] font-mono text-ink-3 truncate max-w-[200px]">{document.fileName}</p>
    </div>
  )

  return (
    <PreviewCanvas floatingActions={floatingActions}>
      <div className="h-full w-full p-4 lg:p-6">
        <iframe 
          title="Uploaded PDF preview" 
          src={`${document.objectUrl}#navpanes=0&view=Fit`}
          className="h-full w-full border-0 bg-white shadow-lg rounded-sm" 
        />
      </div>
    </PreviewCanvas>
  )
}

function EmptySourcePreview() {
  return (
    <PreviewCanvas>
      <div className="flex h-full items-center justify-center p-6 text-center opacity-70 sm:p-10 lg:p-32">
        <div className="max-w-xs space-y-4 sm:space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-bg-2 shadow-sm sm:h-36 sm:w-36 lg:h-48 lg:w-48">
            <Icon name="device" size={20} className="text-ink-4" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-sm font-semibold text-ink">Source Viewer</h2>
            <p className="text-xs leading-relaxed text-ink-3">
              Upload a PDF to preview the source file locally.
            </p>
          </div>
        </div>
      </div>
    </PreviewCanvas>
  )
}
