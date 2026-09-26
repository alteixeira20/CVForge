export interface PdfPageEvidence {
  text: string
  lineCount: number
  itemCount: number
  fragmentedLineRatio: number
  possibleColumnOrder: boolean
}

export interface ExtractionSignal {
  id: string
  status: 'pass' | 'warn' | 'fail'
  priority: 'high' | 'medium' | 'low'
  label: string
  detected: string
  why: string
  suggestion: string
  points: number
  maxPoints: number
}

export interface PdfExtractionDiagnostics {
  signals: ExtractionSignal[]
  selectableCharacters: number
  emptyPageCount: number
}

export function analyzeExtractionEvidence(pages: PdfPageEvidence[]): PdfExtractionDiagnostics {
  const text = pages.map((page) => page.text).join('\n')
  const selectableCharacters = text.replace(/\s/g, '').length
  const emptyPageCount = pages.filter((page) => page.text.replace(/\s/g, '').length < 20).length
  const averageCharacters = pages.length ? Math.round(selectableCharacters / pages.length) : 0
  const repeatedEdgeCount = repeatedPageEdges(pages)
  const fragmentedPages = pages.filter((page) => page.lineCount >= 12 && page.fragmentedLineRatio > 0.55).length
  const columnOrderPages = pages.filter((page) => page.possibleColumnOrder).length
  const replacementCount = (text.match(/\uFFFD/g) ?? []).length
  const nonWhitespace = text.match(/\S/g)?.length ?? 0
  const noiseCount = (text.match(/[^\p{L}\p{N}\s.,;:!?%€$£@/()&+_'’"“”\-\u2013\u2014]/gu) ?? []).length
  const noiseRatio = nonWhitespace ? noiseCount / nonWhitespace : 0

  return {
    selectableCharacters,
    emptyPageCount,
    signals: [
      signal(
        'selectable-text',
        selectableCharacters >= 200 ? 'pass' : selectableCharacters >= 40 ? 'warn' : 'fail',
        'high',
        'Selectable text',
        selectableCharacters
          ? `${selectableCharacters} non-space selectable characters were extracted.`
          : 'No selectable text was extracted.',
        'Local ATS-style checks depend on text content rather than page images alone.',
        'Export a text-based PDF. CVForge does not provide OCR for scanned or image-only files.',
        selectableCharacters >= 200 ? 8 : selectableCharacters >= 40 ? 3 : 0,
        8,
      ),
      signal(
        'text-density',
        averageCharacters >= 250 ? 'pass' : averageCharacters >= 100 ? 'warn' : 'fail',
        'high',
        'Text per page',
        `The PDF averages about ${averageCharacters} selectable characters per page.`,
        'Very sparse extraction can indicate scanned pages, missing text layers, or failed extraction.',
        'Check that every intended page contains selectable text and re-export the source PDF if needed.',
        averageCharacters >= 250 ? 5 : averageCharacters >= 100 ? 2 : 0,
        5,
      ),
      signal(
        'empty-pages',
        emptyPageCount === 0 ? 'pass' : emptyPageCount < pages.length ? 'warn' : 'fail',
        'high',
        'Pages with little text',
        emptyPageCount === 0
          ? 'Every page contains a usable amount of selectable text.'
          : `${emptyPageCount} of ${pages.length} pages contain almost no selectable text.`,
        'Image-only or unexpectedly empty pages can hide important CV content from text extraction.',
        'Replace scanned pages with text-based pages or remove unintended blank pages.',
        emptyPageCount === 0 ? 4 : emptyPageCount < pages.length ? 1 : 0,
        4,
      ),
      signal(
        'repeated-edges',
        repeatedEdgeCount === 0 ? 'pass' : 'warn',
        'low',
        'Repeated headers or footers',
        repeatedEdgeCount === 0
          ? 'No repeated page-edge text signal was detected.'
          : `${repeatedEdgeCount} repeated header or footer signal${repeatedEdgeCount === 1 ? ' was' : 's were'} detected across pages.`,
        'Repeated page furniture can be mixed into extracted CV content.',
        'Keep headers and footers short, and verify the extracted reading order.',
        repeatedEdgeCount === 0 ? 2 : 1,
        2,
      ),
      signal(
        'line-fragmentation',
        fragmentedPages === 0 ? 'pass' : 'warn',
        'medium',
        'Line fragmentation',
        fragmentedPages === 0
          ? 'Extracted lines are not unusually fragmented.'
          : `${fragmentedPages} page${fragmentedPages === 1 ? '' : 's'} contain many short extracted fragments.`,
        'Heavy fragmentation may split names, dates, or bullet statements into an unreliable order.',
        'Use simpler text boxes and verify the text selection order in a PDF viewer.',
        fragmentedPages === 0 ? 3 : 1,
        3,
      ),
      signal(
        'reading-order',
        columnOrderPages === 0 ? 'pass' : 'warn',
        'medium',
        'Reading-order signal',
        columnOrderPages === 0
          ? 'No strong multi-column reading-order signal was detected.'
          : `${columnOrderPages} page${columnOrderPages === 1 ? '' : 's'} show a possible multi-column or extraction-order issue.`,
        'Columns and positioned text can be extracted in an order different from the visual page.',
        'Review copied text in reading order; consider a simpler single-column layout if it is scrambled.',
        columnOrderPages === 0 ? 3 : 1,
        3,
      ),
      signal(
        'replacement-characters',
        replacementCount === 0 ? 'pass' : replacementCount <= 2 ? 'warn' : 'fail',
        'medium',
        'Garbled characters',
        replacementCount === 0
          ? 'No Unicode replacement characters were extracted.'
          : `${replacementCount} Unicode replacement character${replacementCount === 1 ? ' was' : 's were'} extracted.`,
        'Replacement characters can hide names, skills, and keywords.',
        'Embed supported fonts and verify accented characters after export.',
        replacementCount === 0 ? 3 : replacementCount <= 2 ? 1 : 0,
        3,
      ),
      signal(
        'symbol-noise',
        noiseRatio <= 0.04 ? 'pass' : noiseRatio <= 0.12 ? 'warn' : 'fail',
        'medium',
        'Symbol and noise ratio',
        `Unusual symbols account for about ${Math.round(noiseRatio * 100)}% of extracted non-space characters.`,
        'A high noise ratio can indicate broken font encoding or an unusable text layer.',
        'Re-export with embedded fonts and inspect the copied text for corruption.',
        noiseRatio <= 0.04 ? 2 : noiseRatio <= 0.12 ? 1 : 0,
        2,
      ),
      signal(
        'page-count',
        pages.length <= 4 ? 'pass' : pages.length <= 10 ? 'warn' : 'fail',
        'low',
        'Page count',
        `The PDF contains ${pages.length} page${pages.length === 1 ? '' : 's'}.`,
        'Unusually long CVs are harder to review and may include low-value or duplicated content.',
        'Keep the document focused on relevant evidence for the intended role.',
        pages.length <= 4 ? 2 : pages.length <= 10 ? 1 : 0,
        2,
      ),
    ],
  }
}

function repeatedPageEdges(pages: PdfPageEvidence[]) {
  if (pages.length < 2) return 0
  const edges = pages.flatMap((page) => {
    const lines = page.text.split('\n').map(normalizeEdge).filter((line) => line.length >= 4)
    return [lines[0], lines.at(-1)].filter((line): line is string => Boolean(line))
  })
  const counts = new Map<string, number>()
  edges.forEach((edge) => counts.set(edge, (counts.get(edge) ?? 0) + 1))
  return [...counts.values()].filter((count) => count >= 2).length
}

function normalizeEdge(value: string | undefined) {
  return (value ?? '').toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim()
}

function signal(
  id: string,
  status: ExtractionSignal['status'],
  priority: ExtractionSignal['priority'],
  label: string,
  detected: string,
  why: string,
  suggestion: string,
  points: number,
  maxPoints: number,
): ExtractionSignal {
  return { id, status, priority, label, detected, why, suggestion, points, maxPoints }
}
