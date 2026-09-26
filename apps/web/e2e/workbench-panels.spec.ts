import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts } from 'pdf-lib'

async function textPdf() {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const page = pdf.addPage([595, 842])
  const lines = [
    'Alex Morgan',
    'alex@example.org | +44 20 7946 0000 | London',
    'Work Experience',
    'Senior Engineer, Example Ltd, 2019 - 2024',
    'Led a platform migration used by 12,000 customers and cut costs by 30%.',
    'Education',
    'BSc Computer Science, Example University, 2015 - 2019',
    'Skills',
    'TypeScript, React, PostgreSQL',
  ]
  lines.forEach((line, index) => page.drawText(line, { x: 50, y: 780 - index * 24, size: 12, font }))
  return Buffer.from(await pdf.save())
}

test('Analyzer results survive mobile Analysis and Source switching', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/analyzer')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'mobile-candidate.pdf',
    mimeType: 'application/pdf',
    buffer: await textPdf(),
  })
  const dimension = page.locator('[data-analysis-dimension="completeness"]')
  await expect(dimension).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('mobile-candidate.pdf').first()).toBeVisible()
  await expect.poll(() => dimension.textContent(), { timeout: 20_000 }).not.toMatch(/^Completeness0/)
  const scores = await page.locator('[data-analysis-dimension]').allTextContents()

  const nav = page.locator('.workbench-mobile-nav')
  await nav.getByRole('button', { name: 'Source' }).click()
  await expect(dimension).toBeHidden()
  await expect(page.locator('.canvas canvas, .canvas iframe, .canvas embed, .canvas object').first())
    .toBeVisible({ timeout: 20_000 })
  await nav.getByRole('button', { name: 'Analysis' }).click()
  await expect(dimension).toBeVisible()
  expect(await page.locator('[data-analysis-dimension]').allTextContents()).toEqual(scores)
})

test('desktop workbench shows both panels on first paint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/builder')
  await expect(page.getByLabel('Full Name')).toBeVisible()
  await expect(page.locator('.bg-bg-inset .canvas')).toBeVisible()
  await expect(page.locator('.workbench-mobile-nav')).toBeHidden()
})
