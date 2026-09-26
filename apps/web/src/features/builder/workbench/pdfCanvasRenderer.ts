import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { RenderedPage, RenderProgress } from './pdfPreviewTypes'
import { getPreviewWorker, resetPreviewWorker } from './pdfPreviewWorker'

// A worker that crashed or was closed never answers; fail instead of hanging.
const DOCUMENT_LOAD_TIMEOUT_MS = 10_000

export async function renderPdfPages(
  blob: Blob,
  renderScale: number,
  isCancelled: () => boolean,
  onProgress: (p: RenderProgress) => void,
): Promise<RenderedPage[] | null> {
  // 'preparing' already reported by the hook before calling us.
  const pdfjs = await import('pdfjs-dist')
  const worker = await getPreviewWorker(pdfjs)
  if (isCancelled()) return null

  const data = new Uint8Array(await blob.arrayBuffer())
  if (isCancelled()) return null

  // Destroying the loading task in finally releases the document on success,
  // cancellation, and errors alike. The shared worker is not owned by the
  // task; it is replaced only after a failure.
  const loadingTask = pdfjs.getDocument({ data, worker })
  try {
    const pdfDoc = await withTimeout(loadingTask.promise, DOCUMENT_LOAD_TIMEOUT_MS)
    if (isCancelled()) return null
    return await renderAllPages(pdfDoc, renderScale, isCancelled, onProgress)
  } catch (error) {
    resetPreviewWorker()
    throw error
  } finally {
    void loadingTask.destroy()
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer = 0
  const timeout = new Promise<never>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error('PDF preview worker did not respond.')), timeoutMs)
  })
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer))
}

async function renderAllPages(
  pdfDoc: PDFDocumentProxy,
  renderScale: number,
  isCancelled: () => boolean,
  onProgress: (p: RenderProgress) => void,
): Promise<RenderedPage[] | null> {
  const total = pdfDoc.numPages
  onProgress({ stage: 'rendering', pagesDone: 0, pagesTotal: total })
  const rendered: RenderedPage[] = []

  for (let n = 1; n <= total; n++) {
    if (isCancelled()) return null
    rendered.push(await renderPage(pdfDoc, n, renderScale))
    if (isCancelled()) return null
    onProgress({ stage: 'rendering', pagesDone: n, pagesTotal: total })
  }
  return rendered
}

async function renderPage(pdfDoc: PDFDocumentProxy, pageNumber: number, renderScale: number) {
  const page = await pdfDoc.getPage(pageNumber)
  try {
    const baseVp = page.getViewport({ scale: 1 })
    const renderVp = page.getViewport({ scale: renderScale })
    const canvas = document.createElement('canvas')
    canvas.width = renderVp.width
    canvas.height = renderVp.height

    const ctx = canvas.getContext('2d')
    if (ctx) {
      await page.render({ canvas, canvasContext: ctx, viewport: renderVp }).promise
    }
    return { canvas, baseWidth: baseVp.width, baseHeight: baseVp.height }
  } finally {
    page.cleanup()
  }
}
