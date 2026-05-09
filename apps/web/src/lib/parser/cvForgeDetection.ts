import { type PdfMetadata } from './pdfTextExtraction'

export function isCvForgeGenerated(metadata: PdfMetadata): boolean {
  const creator = String(metadata.Creator || metadata.creator || '').toLowerCase()
  const producer = String(metadata.Producer || metadata.producer || '').toLowerCase()
  const subject = String(metadata.Subject || metadata.subject || '').toLowerCase()
  const keywords = String(metadata.Keywords || metadata.keywords || '').toLowerCase()

  return (
    creator === 'cvforge' ||
    producer.includes('cvforge') ||
    subject.includes('cvforge backup candidate') ||
    keywords.includes('cvforge')
  )
}
