import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-6">
      <section className="max-w-lg text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ember">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">This CVForge page does not exist</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          Continue with the local-first Builder or analyze a PDF without uploading it to a server.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className="btn primary" href="/builder">Open Builder</Link>
          <Link className="btn" href="/analyzer">Open Analyzer</Link>
          <Link className="btn" href="/">Home</Link>
        </div>
      </section>
    </main>
  )
}
