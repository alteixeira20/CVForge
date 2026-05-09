import { type PdfExtractionResult } from '@/lib/parser/pdfTextExtraction'

export interface ParserDocument {
  fileName: string
  objectUrl: string
  extraction?: PdfExtractionResult
  error?: string
}
