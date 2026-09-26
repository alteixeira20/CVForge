import type { PDFWorker } from 'pdfjs-dist'

type PdfJs = typeof import('pdfjs-dist')

const WORKER_READY_TIMEOUT_MS = 15_000

let workerPromise: Promise<PDFWorker> | null = null

// One pdf.js worker is shared by all preview renders. It is created from our
// own module Worker so a failed load surfaces as an error (and can be retried)
// instead of pdf.js falling back to a main-thread import whose failure the
// browser caches for the lifetime of the page.
export function getPreviewWorker(pdfjs: PdfJs): Promise<PDFWorker> {
  if (!workerPromise) {
    workerPromise = startWorker(pdfjs).catch((error: unknown) => {
      workerPromise = null
      throw error
    })
  }
  return workerPromise
}

export function resetPreviewWorker() {
  const current = workerPromise
  workerPromise = null
  void current?.then((worker) => worker.destroy()).catch(() => undefined)
}

async function startWorker(pdfjs: PdfJs): Promise<PDFWorker> {
  const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
  const port = new Worker(workerUrl, { type: 'module' })
  await waitForReady(port)
  return pdfjs.PDFWorker.create({ port })
}

function waitForReady(port: Worker): Promise<void> {
  return new Promise((resolve, reject) => {
    const fail = (reason: string) => {
      cleanup()
      port.terminate()
      reject(new Error(reason))
    }
    const onMessage = (event: MessageEvent) => {
      if (event.data?.action !== 'ready') return
      cleanup()
      resolve()
    }
    const onError = () => fail('PDF preview worker failed to load.')
    const timer = window.setTimeout(() => fail('PDF preview worker did not start.'), WORKER_READY_TIMEOUT_MS)
    const cleanup = () => {
      window.clearTimeout(timer)
      port.removeEventListener('message', onMessage)
      port.removeEventListener('error', onError)
    }
    port.addEventListener('message', onMessage)
    port.addEventListener('error', onError)
  })
}
