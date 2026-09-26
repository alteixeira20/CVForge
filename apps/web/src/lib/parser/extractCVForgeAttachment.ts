import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'
import { type CVState, parseCVState } from '@/types/cv'
import { migrateCVState } from '@/lib/cvMigrations'

export const CVFORGE_ATTACHMENT_NAME = 'cvforge-state.json'

type AttachmentSource = Pick<PDFDocumentProxy, 'getAttachments' | 'getAttachmentContent'>

export async function extractCVForgeAttachment(
  file: File,
  options: { signal?: AbortSignal } = {},
): Promise<CVState | null> {
  let loadingTask: PDFDocumentLoadingTask | null = null
  const abortLoading = () => {
    void loadingTask?.destroy()
  }
  try {
    if (options.signal?.aborted) return null
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

    loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
    options.signal?.addEventListener('abort', abortLoading, { once: true })
    const pdf = await loadingTask.promise
    if (options.signal?.aborted) return null

    const content = await readCVForgeAttachment(pdf)
    if (!content) return null
    const parsed = JSON.parse(new TextDecoder().decode(content))
    return parseCVState(migrateCVState(parsed))
  } catch (error) {
    if (!options.signal?.aborted) console.warn('Failed to extract CVForge attachment:', error)
    return null
  } finally {
    options.signal?.removeEventListener('abort', abortLoading)
    // PDF.js 6 releases the document through its loading task only.
    try {
      await loadingTask?.destroy()
    } catch {
      // Loading-task cleanup is best effort after parse failure.
    }
  }
}

// PDF.js 6 returns attachments as a Map keyed by the embedded-file name, and
// usually omits the bytes, which are then fetched on demand.
export async function readCVForgeAttachment(pdf: AttachmentSource): Promise<Uint8Array | null> {
  const attachments = await pdf.getAttachments()
  if (!attachments) return null

  for (const [id, attachment] of attachments) {
    const isCVForgeState = id === CVFORGE_ATTACHMENT_NAME || attachment.filename === CVFORGE_ATTACHMENT_NAME
    if (!isCVForgeState) continue
    return attachment.content ?? await pdf.getAttachmentContent(id) ?? null
  }
  return null
}
