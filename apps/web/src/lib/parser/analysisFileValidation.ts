import {
  MAX_ANALYSIS_FILE_BYTES,
  MAX_ANALYSIS_FILE_MEGABYTES,
  MAX_ANALYSIS_PAGES,
} from './analysisLimits'

export interface AnalysisFile {
  name: string
  type: string
  size: number
  slice: (start?: number, end?: number) => {
    arrayBuffer: () => Promise<ArrayBufferLike>
  }
}

export async function validateAnalysisFile(file: AnalysisFile): Promise<string | null> {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return 'CVForge currently analyzes PDF files only. DOCX and plain-text analysis are not supported yet.'
  }
  if (file.type && file.type !== 'application/pdf' && file.type !== 'application/x-pdf') {
    return `The selected file reports the unsupported type “${file.type}”. Choose a PDF file.`
  }
  if (file.size === 0) {
    return 'The selected PDF is empty (0 bytes). Choose a complete PDF file.'
  }
  if (file.size > MAX_ANALYSIS_FILE_BYTES) {
    return `This PDF is larger than the ${MAX_ANALYSIS_FILE_MEGABYTES} MB local analysis limit. Reduce the file size and try again.`
  }

  const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer())
  const header = String.fromCharCode(...signature)
  if (header !== '%PDF-') {
    return 'The selected file does not contain a valid PDF signature. It may be renamed, malformed, or truncated.'
  }
  return null
}

export function validateAnalysisPageCount(pageCount: number) {
  if (pageCount <= MAX_ANALYSIS_PAGES) return null
  return `This PDF has ${pageCount} pages. Local analysis is limited to ${MAX_ANALYSIS_PAGES} pages.`
}
