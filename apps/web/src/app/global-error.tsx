'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#100d0b', color: '#f6eee9' }}>
          <section style={{ maxWidth: 560, textAlign: 'center' }}>
            <h1>CVForge could not render this view</h1>
            <p>Your browser-saved CV has not been intentionally cleared.</p>
            <button type="button" onClick={reset}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  )
}
