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
      <div className="flex h-full items-center justify-center p-32 text-center opacity-70">
        <div className="max-w-xs space-y-6">
          <div className="w-48 h-48 rounded-full bg-bg-2 border border-border flex items-center justify-center mx-auto shadow-sm">
            <Icon name="device" size={20} className="text-ink-4" />
          </div>
          <div className="space-y-4">
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
