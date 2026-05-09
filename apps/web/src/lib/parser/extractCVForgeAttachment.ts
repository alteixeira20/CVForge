import { type CVState, parseCVState } from '@/types/cv'

export async function extractCVForgeAttachment(file: File): Promise<CVState | null> {
  try {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
    
    // Check for attachments (embedded files)
    const attachments = await pdf.getAttachments()
    if (!attachments || !attachments['cvforge-state.json']) return null
    
    const attachment = attachments['cvforge-state.json']
    const jsonString = new TextDecoder().decode(attachment.content)
    const parsed = JSON.parse(jsonString)
    
    return parseCVState(parsed)
  } catch (error) {
    console.warn('Failed to extract CVForge attachment:', error)
    return null
  }
}
