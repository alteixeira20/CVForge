'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error)
  }, [error])

  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-6">
      <section className="max-w-lg rounded-xl border border-border bg-bg-2/90 p-8 text-center shadow-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ember">
          Recovery
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">CVForge hit an unexpected error</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          Your valid local CV data has not been cleared. Retry this view, or return to Builder
          and restore a JSON backup if needed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn primary" onClick={reset}>Try again</button>
          <Link className="btn" href="/builder">Open Builder</Link>
          <Link className="btn" href="/">Home</Link>
        </div>
      </section>
    </main>
  )
}
