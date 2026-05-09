import { type CVState } from '@/types/cv'

export async function embedCVStateAttachment(pdfBlob: Blob, state: CVState): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib')
  
  const pdfBytes = await pdfBlob.arrayBuffer()
  const pdfDoc = await PDFDocument.load(pdfBytes)
  
  const stateJson = JSON.stringify(state, null, 2)
  const stateBytes = new TextEncoder().encode(stateJson)
  
  await pdfDoc.attach(stateBytes, 'cvforge-state.json', {
    mimeType: 'application/json',
    description: 'CVForge session state for easy restoration.',
    creationDate: new Date(),
    modificationDate: new Date(),
  })
  
  const modifiedPdfBytes = await pdfDoc.save()
  return new Blob([modifiedPdfBytes as unknown as BlobPart], { type: 'application/pdf' })
}
