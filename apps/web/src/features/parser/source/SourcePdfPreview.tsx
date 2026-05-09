import { Icon } from '@/components/ui/Icon'
import { type ParserDocument } from '../upload/parserTypes'

export function SourcePdfPreview({ document }: { document: ParserDocument | null }) {
  if (!document?.objectUrl) return <EmptySourcePreview />

  return (
    <div className="h-full flex flex-col p-20 gap-12">
      <div className="panel p-12 bg-bg-2 border border-border rounded-lg">
        <p className="text-xs text-ink-3 truncate">{document.fileName}</p>
      </div>
      <iframe title="Uploaded PDF preview" src={document.objectUrl} className="w-full flex-1 rounded-lg border border-border bg-bg-inset" />
    </div>
  )
}

function EmptySourcePreview() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-40 opacity-70">
      <div className="w-full h-full border border-border-strong bg-bg-inset rounded-lg flex flex-col items-center justify-center text-center p-40">
        <Icon name="device" size={40} strokeWidth={1} className="mb-20 text-ink-4" />
        <h2 className="text-xl font-light text-ink-3">Source Viewer</h2>
        <p className="text-sm text-ink-4 mt-8 max-w-xs">Upload a PDF to preview the source file locally.</p>
      </div>
    </div>
  )
}
