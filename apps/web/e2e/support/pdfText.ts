import { readFile } from 'node:fs/promises'
import { type Page } from '@playwright/test'

export interface PdfTextItemBounds {
  pageNumber: number
  pageWidth: number
  str: string
  left: number
  right: number
}

export interface ExtractedPdf {
  lines: string[]
  maxRight: number
  minLeft: number
  pageWidth: number
  textItems: PdfTextItemBounds[]
}

export async function downloadBuilderPdf(page: Page) {
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download' }).click()
  return readFile((await (await download).path())!)
}

// Text items and their horizontal bounds, read with pdf.js the way an ATS would.
export async function extractPdf(buffer: Buffer): Promise<ExtractedPdf> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), verbosity: 0 })
  const doc = await loadingTask.promise
  const lines: string[] = []
  const textItems: PdfTextItemBounds[] = []
  let maxRight = Number.NEGATIVE_INFINITY
  let minLeft = Number.POSITIVE_INFINITY
  let pageWidth = 0

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const pdfPage = await doc.getPage(pageNumber)
    const currentPageWidth = pdfPage.getViewport({ scale: 1 }).width
    pageWidth = currentPageWidth

    for (const item of (await pdfPage.getTextContent()).items) {
      if (!('str' in item) || item.str === '') continue

      const left = item.transform[4]
      const right = left + item.width

      lines.push(item.str)
      textItems.push({
        pageNumber,
        pageWidth: currentPageWidth,
        str: item.str,
        left,
        right,
      })
      maxRight = Math.max(maxRight, right)
      minLeft = Math.min(minLeft, left)
    }
  }

  await loadingTask.destroy()

  return {
    lines,
    maxRight: Number.isFinite(maxRight) ? maxRight : 0,
    minLeft: Number.isFinite(minLeft) ? minLeft : 0,
    pageWidth,
    textItems,
  }
}

// Rejoins wrapped lines, dropping the one hyphen the PDF layout adds at each
// line break inside a word.
export function joinWrapped(lines: string[]) {
  return lines.map((line) => line.replace(/-$/, '')).join('')
}
