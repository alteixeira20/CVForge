import { type CVState, parseCVState } from '@/types/cv'
import { migrateCVState } from '@/lib/cvMigrations'

export async function extractCVForgeAttachment(
  file: File,
  options: { signal?: AbortSignal } = {},
): Promise<CVState | null> {
  let loadingTask: { promise: Promise<unknown>; destroy: () => Promise<void> } | null = null
  let pdf: PdfAttachmentDocument | null = null
  try {
    if (options.signal?.aborted) return null
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

    loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
    const abortLoading = () => {
      void loadingTask?.destroy()
    }
    options.signal?.addEventListener('abort', abortLoading, { once: true })
    pdf = await loadingTask.promise as PdfAttachmentDocument
    options.signal?.removeEventListener('abort', abortLoading)
    if (!pdf || options.signal?.aborted) return null
    
    // Check for attachments (embedded files)
    const attachments = await pdf.getAttachments()
    if (!attachments || !attachments['cvforge-state.json']) return null
    
    const attachment = attachments['cvforge-state.json']
    const jsonString = new TextDecoder().decode(attachment.content)
    const parsed = JSON.parse(jsonString)
    
    return parseCVState(migrateCVState(parsed))
  } catch (error) {
    if (!options.signal?.aborted) console.warn('Failed to extract CVForge attachment:', error)
    return null
  } finally {
    try {
      await pdf?.destroy()
    } catch {
      // The loading task may already have released the document.
    }
    try {
      await loadingTask?.destroy()
    } catch {
      // Loading-task cleanup is best effort after parse failure.
    }
  }
}

interface PdfAttachmentDocument {
  getAttachments: () => Promise<Record<string, { content: Uint8Array }> | null>
  destroy: () => Promise<void>
}
