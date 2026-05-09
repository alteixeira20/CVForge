import { type ParserDocument } from '../upload/parserTypes'

export function ExtractionDiagnostics({ document }: { document: ParserDocument | null }) {
  if (!document) return <EmptyDiagnostics />

  const extraction = document.extraction
  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-12">
      <h2 className="text-sm font-semibold text-ink">Extraction</h2>
      <DiagnosticRow label="File" value={document.fileName} />
      <DiagnosticRow label="Pages" value={extraction ? String(extraction.pageCount) : 'Unavailable'} />
      <DiagnosticRow label="Characters" value={extraction ? String(extraction.text.length) : '0'} />
      {document.error && <p className="text-xs text-red-300">{document.error}</p>}
      {extraction?.warnings.map((warning) => <p key={warning} className="text-xs text-amber-200">{warning}</p>)}
    </section>
  )
}

function EmptyDiagnostics() {
  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl">
      <h2 className="text-sm font-semibold text-ink">Extraction</h2>
      <p className="text-xs text-ink-3 mt-4">Upload a PDF to inspect page count and extracted text.</p>
    </section>
  )
}

function DiagnosticRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-16 text-xs">
      <span className="text-ink-4">{label}</span>
      <span className="text-ink text-right truncate">{value}</span>
    </div>
  )
}
