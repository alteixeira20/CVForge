import { type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

export interface ExtractedPdf {
  lines: string[]
  maxRight: number
  pageWidth: number
}

export async function downloadBuilderPdf(page: Page) {
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download' }).click()
  return readFile((await (await download).path())!)
}

// Text items and their right edges, read with pdf.js the way an ATS would.
export async function extractPdf(buffer: Buffer): Promise<ExtractedPdf> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), verbosity: 0 })
  const doc = await loadingTask.promise
  const lines: string[] = []
  let maxRight = 0
  let pageWidth = 0
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const pdfPage = await doc.getPage(pageNumber)
    pageWidth = pdfPage.getViewport({ scale: 1 }).width
    for (const item of (await pdfPage.getTextContent()).items) {
      if (!('str' in item) || item.str === '') continue
      lines.push(item.str)
      maxRight = Math.max(maxRight, item.transform[4] + item.width)
    }
  }
  await loadingTask.destroy()
  return { lines, maxRight, pageWidth }
}

// Rejoins wrapped lines, dropping the one hyphen the PDF layout adds at each
// line break inside a word.
export function joinWrapped(lines: string[]) {
  return lines.map((line) => line.replace(/-$/, '')).join('')
}
