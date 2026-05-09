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
  metadata: PdfMetadata
  warnings: string[]
}

export async function extractPdfText(file: File): Promise<PdfExtractionResult> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const pageTexts = await extractPageTexts(pdf)
  const text = pageTexts.join('\n\n')
  
  const { info } = await pdf.getMetadata()
  const metadata = (info || {}) as PdfMetadata

  return {
    pageCount: pdf.numPages,
    text,
    pageTexts,
    metadata,
    warnings: text.trim() ? [] : ['No selectable text was found in this PDF.'],
  }
}

async function extractPageTexts(pdf: { numPages: number; getPage: (pageNumber: number) => Promise<PdfPage> }) {
  const pages = Array.from({ length: pdf.numPages }, (_, index) => index + 1)
  return Promise.all(pages.map((pageNumber) => extractPageText(pdf, pageNumber)))
}

async function extractPageText(pdf: { getPage: (pageNumber: number) => Promise<PdfPage> }, pageNumber: number) {
  const page = await pdf.getPage(pageNumber)
  const content = await page.getTextContent()
  return content.items.map(readTextItem).filter(Boolean).join(' ')
}

function readTextItem(item: unknown) {
  if (!item || typeof item !== 'object' || !('str' in item)) return ''
  const value = (item as { str: unknown }).str
  return typeof value === 'string' ? value.trim() : ''
}

interface PdfPage {
  getTextContent: () => Promise<{ items: unknown[] }>
}
