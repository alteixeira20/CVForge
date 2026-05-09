import { type ParserDocument } from '../upload/parserTypes'

export function TextPreview({ document }: { document: ParserDocument | null }) {
  const text = document?.extraction?.text.trim()

  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-12">
      <h2 className="text-sm font-semibold text-ink">Extracted Text</h2>
      {text ? (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-ink-3 font-mono">{text}</pre>
      ) : (
        <p className="text-xs text-ink-3">No extracted text is available yet.</p>
      )}
    </section>
  )
}
