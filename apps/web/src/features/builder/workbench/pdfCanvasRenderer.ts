import type { RenderedPage, RenderProgress } from './pdfPreviewTypes'

export async function renderPdfPages(
  blob: Blob,
  renderScale: number,
  isCancelled: () => boolean,
  onProgress: (p: RenderProgress) => void,
): Promise<RenderedPage[] | null> {
  // 'preparing' already reported by the hook before calling us.
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  if (isCancelled()) return null

  const data = new Uint8Array(await blob.arrayBuffer())
  if (isCancelled()) return null

  const pdfDoc = await pdfjs.getDocument({ data }).promise
  if (isCancelled()) { void pdfDoc.destroy(); return null }

  const total = pdfDoc.numPages
  onProgress({ stage: 'rendering', pagesDone: 0, pagesTotal: total })

  const rendered: RenderedPage[] = []

  for (let n = 1; n <= total; n++) {
    if (isCancelled()) { void pdfDoc.destroy(); return null }

    const page = await pdfDoc.getPage(n)
    const baseVp = page.getViewport({ scale: 1 })
    const renderVp = page.getViewport({ scale: renderScale })

    const canvas = document.createElement('canvas')
    canvas.width = renderVp.width
    canvas.height = renderVp.height

    const ctx = canvas.getContext('2d')
    if (ctx) {
      await page.render({ canvas, canvasContext: ctx, viewport: renderVp }).promise
    }
    page.cleanup()

    if (isCancelled()) { void pdfDoc.destroy(); return null }

    rendered.push({ canvas, baseWidth: baseVp.width, baseHeight: baseVp.height })
    onProgress({ stage: 'rendering', pagesDone: n, pagesTotal: total })
  }

  void pdfDoc.destroy()
  return rendered
}
