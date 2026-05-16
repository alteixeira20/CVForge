import { type CVState } from '@/types/cv'
import { type PdfExtractionResult, extractPdfText } from '@/lib/parser/pdfTextExtraction'
import { type HeuristicResult, parseHeuristicResume } from '@/lib/parser/heuristicResumeParser'
import { extractCVForgeAttachment } from '@/lib/parser/extractCVForgeAttachment'

export interface PdfImportAnalysis {
  extraction: PdfExtractionResult
  embeddedState?: CVState
  heuristic?: HeuristicResult
}

export type PdfImportResult = 
  | { success: true; analysis: PdfImportAnalysis }
  | { success: false; error: string }

/**
 * Orchestrates the extraction and analysis of a PDF file for CV data.
 * It first attempts to find an embedded CVForge session, falling back
 * to heuristic parsing if no session is found.
 */
export async function analyzePdfImport(file: File): Promise<PdfImportResult> {
  try {
    const [extraction, embeddedState] = await Promise.all([
      extractPdfText(file),
      extractCVForgeAttachment(file)
    ])

    // If we have an embedded state, we don't need to run heuristics for the primary import path
    // though the extraction is still useful for diagnostics in the Parser view.
    const heuristic = !embeddedState ? parseHeuristicResume(extraction.text) : undefined

    return {
      success: true,
      analysis: {
        extraction,
        embeddedState: embeddedState || undefined,
        heuristic: heuristic || undefined
      }
    }
  } catch (err) {
    console.error('PDF Import Analysis failed:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to analyze PDF file.'
    }
  }
}
