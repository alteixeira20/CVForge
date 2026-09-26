import { expect, test, type Page, type Request } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { PDFDocument, StandardFonts } from 'pdf-lib'

// Privacy invariant: CV content never leaves the browser. Every request in a
// full journey must be a same-origin read that carries no CV content.
const MARKER = `PrivacyMarker${Date.now().toString(36)}`

interface RecordedRequest {
  method: string
  url: string
  body: string
  headers: string
}

function recordRequests(page: Page) {
  const requests: RecordedRequest[] = []
  const record = (request: Request) => {
    requests.push({
      method: request.method(),
      url: request.url(),
      body: request.postData() ?? '',
      headers: JSON.stringify(request.headers()),
    })
  }
  page.context().on('request', record)
  return requests
}

async function markerPdf() {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const page = pdf.addPage([595, 842])
  const lines = [`${MARKER} Candidate`, 'candidate@example.org', 'EXPERIENCE', 'Engineer | Example Co | 2020 - 2024']
  lines.forEach((line, index) => page.drawText(line, { x: 48, y: 790 - index * 28, size: 12, font }))
  return Buffer.from(await pdf.save())
}

async function downloadFrom(page: Page, trigger: () => Promise<void>) {
  const download = page.waitForEvent('download')
  await trigger()
  return readFile((await (await download).path())!)
}

async function chooseImportFile(page: Page, file: { name: string, mimeType: string, buffer: Buffer }) {
  await page.getByRole('button', { name: 'Import' }).click()
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await chooser).setFiles(file)
}

test('a full journey sends no CV content and makes only same-origin reads', async ({ page, baseURL }) => {
  test.setTimeout(90_000)
  const requests = recordRequests(page)
  const origin = new URL(baseURL!).origin

  await page.goto('/builder')
  await page.getByLabel('Full Name').fill(`${MARKER} Owner`)
  await page.getByLabel('Professional Summary').fill(`Summary containing ${MARKER} for the privacy check.`)
  await expect(page.locator('.canvas canvas').first()).toBeVisible({ timeout: 20_000 })

  const builderPdf = await downloadFrom(page, () => page.getByRole('button', { name: 'Download' }).click())
  await downloadFrom(page, () => page.getByRole('button', { name: 'Export' }).click())

  await page.getByRole('toolbar', { name: 'PDF preview controls' }).getByRole('link', { name: 'Analyze' }).click()
  await expect(page).toHaveURL(/\/analyzer\?source=builder$/)
  await expect(page.locator('[data-analysis-dimension="completeness"]')).toBeVisible()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'builder-export.pdf',
    mimeType: 'application/pdf',
    buffer: builderPdf,
  })
  await expect(page.getByText('builder-export.pdf').first()).toBeVisible({ timeout: 20_000 })

  // A fresh page in the same context (requests are recorded per context)
  // avoids Firefox reporting a navigation right after downloads as a download.
  const importPage = await page.context().newPage()
  await importPage.goto('/builder')
  await chooseImportFile(importPage, { name: 'external.pdf', mimeType: 'application/pdf', buffer: await markerPdf() })
  await expect(importPage.getByText('Best-Effort Draft Review')).toBeVisible({ timeout: 20_000 })
  await importPage.getByRole('button', { name: 'Cancel' }).click()

  expect(requests.length).toBeGreaterThan(0)
  const offending = requests.filter((request) => {
    const url = new URL(request.url)
    const isLocalScheme = url.protocol === 'data:' || url.protocol === 'blob:'
    return (!isLocalScheme && url.origin !== origin)
      || !['GET', 'HEAD'].includes(request.method)
      || request.url.includes(MARKER)
      || request.body.includes(MARKER)
      || request.headers.includes(MARKER)
  })
  expect(offending).toEqual([])
})

test('the content security policy limits connections to this origin', async ({ request }) => {
  const response = await request.get('/builder')
  const policy = response.headers()['content-security-policy'] ?? ''
  const connectSource = policy.split(';').map((part) => part.trim()).find((part) => part.startsWith('connect-src'))
  expect(connectSource).toBe("connect-src 'self' data: blob:")
})

test('website fonts load from this origin', async ({ page, baseURL }) => {
  const fontRequests: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url())
  })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('16px Lexend'))).toBe(true)
  expect(fontRequests.length).toBeGreaterThan(0)
  expect(fontRequests.every((url) => url.startsWith(new URL(baseURL!).origin + '/fonts/'))).toBe(true)
})

test('PDF.js workers for the preview and the Analyzer start from this origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  const cspViolations: string[] = []
  page.on('console', (message) => {
    if (/Content Security Policy|Refused to/i.test(message.text())) cspViolations.push(message.text())
  })
  const workerUrls: string[] = []
  page.on('worker', (worker) => workerUrls.push(worker.url()))
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill('Worker Check')
  await expect(page.locator('.canvas canvas').first()).toBeVisible({ timeout: 20_000 })
  const pdfWorkerCount = () => workerUrls.filter((url) => url.includes('pdf.worker')).length
  // Worker events can arrive after the page has used the worker; poll for them.
  await expect.poll(pdfWorkerCount).toBeGreaterThanOrEqual(1)
  await page.goto('/analyzer')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'worker-check.pdf',
    mimeType: 'application/pdf',
    buffer: await markerPdf(),
  })
  await expect(page.getByText('worker-check.pdf').first()).toBeVisible({ timeout: 20_000 })
  await expect(page.locator('[data-analysis-dimension="completeness"]')).toBeVisible()

  await expect.poll(pdfWorkerCount).toBeGreaterThanOrEqual(2)
  expect(workerUrls.some((url) => url.includes('pdf.worker')), JSON.stringify(workerUrls)).toBe(true)
  // Firefox reports worker URLs relative to the page; resolve before comparing.
  const isSameOrigin = (url: string) => url.startsWith('blob:') || new URL(url, origin).origin === origin
  expect(workerUrls.every(isSameOrigin), JSON.stringify(workerUrls)).toBe(true)
  expect(cspViolations).toEqual([])
})
