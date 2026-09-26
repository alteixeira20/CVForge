import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { PDFArray, PDFDict, PDFDocument, PDFHexString, PDFName, PDFString } from 'pdf-lib'

function embeddedFileNames(pdf: PDFDocument) {
  const names = pdf.catalog.lookupMaybe(PDFName.of('Names'), PDFDict)
  const embedded = names?.lookupMaybe(PDFName.of('EmbeddedFiles'), PDFDict)
  const entries = embedded?.lookupMaybe(PDFName.of('Names'), PDFArray)
  if (!entries) return []
  return entries.asArray()
    .filter((entry): entry is PDFString | PDFHexString => entry instanceof PDFString || entry instanceof PDFHexString)
    .map((entry) => entry.decodeText())
}

async function expectNoOverflow(page: Page) {
  await expect.poll(() => page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  )).toBe(true)
}

test('critical navigation, Builder opening, modal focus, and reduced motion work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.ember-canvas')).toHaveCSS('display', 'none')
  await expectNoOverflow(page)

  const trigger = page.locator('.hero').getByRole('button', { name: 'Build your CV' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Start with CVForge' })
  await expect(dialog).toBeVisible()
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await page.getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Builder' })
    .click()
  await expect(page).toHaveURL(/\/builder$/)
  await expectNoOverflow(page)
})

test('critical Analyzer upload and navigation work', async ({ page }) => {
  const scannedPdf = await PDFDocument.create()
  scannedPdf.addPage([595, 842])
  await page.goto('/analyzer')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'cross-browser.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(await scannedPdf.save()),
  })
  await expect(page.getByText('No selectable text was found', { exact: false })).toBeVisible({
    timeout: 20_000,
  })
  await expectNoOverflow(page)
  await page.locator('.app-header').getByRole('link', { name: 'Builder' }).click()
  await expect(page).toHaveURL(/\/builder$/)
})

test('critical JSON restore and PDF export work', async ({ page }) => {
  await page.goto('/builder')
  const name = page.getByLabel('Full Name')
  await name.fill('Cross Browser Owner')
  await expect.poll(() => page.evaluate(() => (
    JSON.parse(localStorage.getItem('cvforge:state') ?? '{}')?.resume?.profile?.name
  ))).toBe('Cross Browser Owner')
  const backup = await page.evaluate(() => localStorage.getItem('cvforge:state')!)
  await name.fill('Replacement Owner')

  await page.getByRole('button', { name: 'Import' }).click()
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await chooser).setFiles({
    name: 'cross-browser.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  })
  await page.getByRole('button', { name: /Replace current CV/ }).click()
  await expect(name).toHaveValue('Cross Browser Owner')

  const backupDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const backupBytes = await readFile((await (await backupDownload).path())!, 'utf8')
  expect(JSON.parse(backupBytes).resume.profile.name).toBe('Cross Browser Owner')

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download' }).click()
  const pdfDownload = await download
  expect(pdfDownload.suggestedFilename()).toMatch(/\.pdf$/)
  const pdfBytes = await readFile((await pdfDownload.path())!)
  const pdf = await PDFDocument.load(pdfBytes)
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
  expect(embeddedFileNames(pdf)).toContain('cvforge-state.json')

  await name.fill('Before Embedded Restore')
  await page.getByRole('button', { name: 'Import' }).click()
  const pdfChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await pdfChooser).setFiles({ name: 'cross-browser.pdf', mimeType: 'application/pdf', buffer: pdfBytes })
  await expect(page.getByText('CVForge Session Detected')).toBeVisible({ timeout: 20_000 })
  await page.getByRole('button', { name: 'Restore Embedded Session' }).click()
  await expect(name).toHaveValue('Cross Browser Owner')
})
