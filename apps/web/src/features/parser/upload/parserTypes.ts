import { type PdfExtractionResult } from '@/lib/parser/pdfTextExtraction'
import { type CVState } from '@/types/cv'

export interface HeuristicResult {
  draft: CVState
  confidence: number
  warnings: string[]
  detectedFields: string[]
}

export interface ParserDocument {
  fileName: string
  objectUrl: string
  extraction?: PdfExtractionResult
  embeddedState?: CVState
  heuristic?: HeuristicResult
  error?: string
}
