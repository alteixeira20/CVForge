import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { findPhantomJoins, isReactPdfProducer, repairPhantomSpaces } from './phantomSpaces'
import { validateAnalysisPageCount } from './analysisFileValidation'
import {
  analyzeExtractionEvidence,
  type PdfExtractionDiagnostics,
  type PdfPageEvidence,
} from './extractionDiagnostics'

export interface PdfMetadata {
  creator?: string
  producer?: string
  subject?: string
  keywords?: string
  [key: string]: unknown
}

export interface PdfExtractionResult {
  pageCount: number
  text: string
  pageTexts: string[]
  pages: PdfPageEvidence[]
  metadata: PdfMetadata
  diagnostics: PdfExtractionDiagnostics
  warnings: string[]
}

export class PdfAnalysisError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'cancelled'
      | 'encrypted'
      | 'malformed'
      | 'page-limit'
      | 'unsupported',
  ) {
    super(message)
    this.name = 'PdfAnalysisError'
  }
}

export async function extractPdfText(
  file: File,
  options: { signal?: AbortSignal } = {},
): Promise<PdfExtractionResult> {
  const { signal } = options
  throwIfAborted(signal)
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    stopAtErrors: true,
  })
  let pdf: PDFDocumentProxy | null = null
  const abortLoading = () => {
    void loadingTask.destroy()
  }
  signal?.addEventListener('abort', abortLoading, { once: true })

  try {
    pdf = await loadingTask.promise
    throwIfAborted(signal)
    const pageCountError = validateAnalysisPageCount(pdf.numPages)
    if (pageCountError) {
      throw new PdfAnalysisError(
        pageCountError,
        'page-limit',
      )
    }

    const { info } = await pdf.getMetadata()
    const repairPhantoms = isReactPdfProducer(info) ? pdfjs.OPS : null
    const pages = await extractPagesSequentially(pdf, repairPhantoms, signal)
    throwIfAborted(signal)
    const pageTexts = pages.map((page) => page.text)
    const text = pageTexts.join('\n\n')
    const metadata = (info || {}) as PdfMetadata
    const diagnostics = analyzeExtractionEvidence(pages)

    return {
      pageCount: pdf.numPages,
      text,
      pageTexts,
      pages,
      metadata,
      diagnostics,
      warnings: diagnostics.signals
        .filter((item) => item.status !== 'pass')
        .map((item) => item.detected),
    }
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) {
      throw new PdfAnalysisError('PDF analysis was cancelled.', 'cancelled')
    }
    if (error instanceof PdfAnalysisError) throw error
    throw classifyPdfError(error)
  } finally {
    signal?.removeEventListener('abort', abortLoading)
    try {
      await pdf?.cleanup()
    } catch {
      // PDF.js may already have released resources after a loading-task failure.
    }
    // PDF.js 6 removed PDFDocumentProxy.destroy(); the loading task owns the document.
    try {
      await loadingTask.destroy()
    } catch {
      // Destruction is idempotent from the caller's perspective.
    }
  }
}

type PdfOps = typeof import('pdfjs-dist').OPS

// `phantomOps` is set only for react-pdf and CVForge documents, whose older
// exports contain phantom spaces inside words (see phantomSpaces.ts).
async function extractPagesSequentially(pdf: PDFDocumentProxy, phantomOps: PdfOps | null, signal?: AbortSignal) {
  const pages: PdfPageEvidence[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    throwIfAborted(signal)
    const page = await pdf.getPage(pageNumber)
    try {
      const content = await page.getTextContent()
      const evidence = pageEvidence(content.items)
      if (phantomOps) evidence.text = repairPhantomSpaces(evidence.text, await phantomJoins(page, phantomOps))
      pages.push(evidence)
    } finally {
      page.cleanup?.()
    }
  }
  return pages
}

async function phantomJoins(page: PDFPageProxy, ops: PdfOps) {
  const list = await page.getOperatorList()
  const runs = list.fnArray.flatMap((fn, index) => (
    fn === ops.showText || fn === ops.showSpacedText ? [list.argsArray[index][0]] : []
  ))
  return findPhantomJoins(runs)
}

export function pageEvidence(items: unknown[]): PdfPageEvidence {
  const positioned = items.map(readTextItem).filter((item): item is TextItem => Boolean(item?.text))
  const lineGroups = new Map<number, TextItem[]>()
  positioned.forEach((item) => {
    const lineKey = Math.round(item.y / 3) * 3
    lineGroups.set(lineKey, [...(lineGroups.get(lineKey) ?? []), item])
  })
  const orderedLines = [...lineGroups.entries()]
    .sort(([left], [right]) => right - left)
    .map(([, lineItems]) => lineItems
      .sort((left, right) => left.x - right.x)
      .map((item) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean)
  const fragmentedLineRatio = orderedLines.length
    ? orderedLines.filter((line) => line.length < 20).length / orderedLines.length
    : 0
  const lineStarts = [...lineGroups.values()]
    .map((lineItems) => Math.min(...lineItems.map((item) => item.x)))
  const lowBand = lineStarts.filter((x) => x < 220).length
  const highBand = lineStarts.filter((x) => x >= 220).length
  const upwardJumps = positioned.slice(1).filter((item, index) => item.y > positioned[index].y + 8).length

  return {
    text: orderedLines.join('\n'),
    lineCount: orderedLines.length,
    itemCount: positioned.length,
    fragmentedLineRatio,
    possibleColumnOrder: (lowBand >= 3 && highBand >= 3) || upwardJumps >= 4,
  }
}

function readTextItem(item: unknown): TextItem | null {
  if (!item || typeof item !== 'object' || !('str' in item)) return null
  const candidate = item as { str: unknown; transform?: unknown }
  if (typeof candidate.str !== 'string' || !candidate.str.trim()) return null
  const transform = Array.isArray(candidate.transform) ? candidate.transform : []
  return {
    text: candidate.str.trim(),
    x: typeof transform[4] === 'number' ? transform[4] : 0,
    y: typeof transform[5] === 'number' ? transform[5] : 0,
  }
}

function classifyPdfError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  const name = error instanceof Error ? error.name : ''
  if (/password|encrypted/i.test(`${name} ${message}`)) {
    return new PdfAnalysisError(
      'This PDF is encrypted or password-protected. Remove the password and export an unprotected copy before analysis.',
      'encrypted',
    )
  }
  if (/invalid pdf|missing pdf|unexpected response|xref|truncated|format/i.test(`${name} ${message}`)) {
    return new PdfAnalysisError(
      'CVForge could not read this PDF. It may be malformed, incomplete, or truncated.',
      'malformed',
    )
  }
  return new PdfAnalysisError(
    'CVForge could not analyze this PDF. Re-export it as a standard, unprotected PDF and try again.',
    'unsupported',
  )
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

interface TextItem {
  text: string
  x: number
  y: number
}

