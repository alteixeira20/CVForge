import { type PdfExtractionResult } from '@/lib/parser/pdfTextExtraction'
import { type CVState } from '@/types/cv'

export interface ParserDocument {
  fileName: string
  objectUrl: string
  extraction?: PdfExtractionResult
  embeddedState?: CVState
  error?: string
}
