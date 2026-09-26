import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { PDFDocument, StandardFonts } from 'pdf-lib'

async function expectNoSeriousViolations(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  const violations = result.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.map((node) => node.target.join(' ')),
    }))
  expect(violations).toEqual([])
}

test('homepage and Builder entry dialog have no serious or critical axe violations', async ({ page }) => {
  await page.goto('/')
  await expectNoSeriousViolations(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await expectNoSeriousViolations(page)
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.locator('.hero').getByRole('button', { name: 'Build your CV' }).click()
  const dialog = page.getByRole('dialog', { name: 'Start with CVForge' })
  await expect(dialog).toBeVisible()
  await dialog.evaluate((element) =>
    Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  )
  await expectNoSeriousViolations(page)
})

test('populated Builder and mobile navigation have no serious or critical axe violations', async ({ page }) => {
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill('Zoë Brontë-Smith')
  await page.getByLabel('Professional Summary').fill('Product engineer focused on accessible and reliable experiences.')
  await expectNoSeriousViolations(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.workbench-mobile-nav').getByRole('button').first()).toBeVisible()
  await expectNoSeriousViolations(page)
})

test('Analyzer empty and result states have no serious or critical axe violations', async ({ page }) => {
  await page.goto('/analyzer')
  await expectNoSeriousViolations(page)

  const document = await PDFDocument.create()
  const font = await document.embedFont(StandardFonts.Helvetica)
  const pdfPage = document.addPage([595, 842])
  pdfPage.drawText('Alex Morgan', { x: 48, y: 790, size: 20, font })
  pdfPage.drawText('EXPERIENCE', { x: 48, y: 740, size: 13, font })
  pdfPage.drawText('Reduced errors by 32% for 12000 users.', { x: 48, y: 710, size: 11, font })
  await page.locator('input[type="file"]').setInputFiles({
    name: 'accessible-result.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(await document.save()),
  })
  await expect(page.getByText('accessible-result.pdf')).toBeVisible({ timeout: 20_000 })
  await expectNoSeriousViolations(page)
})

test('Import review dialog has no serious or critical axe violations', async ({ page }) => {
  await page.goto('/builder')
  await page.getByRole('button', { name: 'Import' }).click()
  const dialog = page.getByRole('dialog', { name: 'Import CV Data' })
  await expect(dialog).toBeVisible()
  await dialog.evaluate((element) =>
    Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  )
  await expectNoSeriousViolations(page)
})
