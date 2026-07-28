import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { PDFDocument, StandardFonts } from 'pdf-lib'

const RESPONSIVE_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
] as const

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  )).toBe(true)
}

async function openEntryDialog(page: Page) {
  const trigger = page.locator('.hero').getByRole('button', { name: 'Build your CV' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Start with CVForge' })
  await expect(dialog).toBeVisible()
  return { dialog, trigger }
}

test('homepage loads without console errors and exposes one strong builder path', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('starts on your machine')
  await expect(page.locator('.site-header').getByText('Builder', { exact: true })).toHaveCount(0)
  await expect(page.locator('.site-header').getByRole('button', { name: 'Build your CV' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Source' }).last()).toBeVisible()
  expect(errors).toEqual([])
})

test('homepage, Builder, and Parser do not overflow the acceptance viewports', async ({ page }) => {
  for (const viewport of RESPONSIVE_VIEWPORTS) {
    await page.setViewportSize(viewport)
    for (const route of ['/', '/builder', '/parser']) {
      await page.goto(route)
      await expectNoHorizontalOverflow(page)
    }
  }
})

test('entry dialog fits compact and short viewports with reachable controls', async ({ page }) => {
  for (const viewport of [
    { width: 430, height: 360 },
    { width: 390, height: 360 },
    { width: 320, height: 320 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const { dialog } = await openEntryDialog(page)
    const bounds = await dialog.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height)
    await expectNoHorizontalOverflow(page)

    for (const button of await dialog.getByRole('button').all()) {
      await button.scrollIntoViewIfNeeded()
      await expect(button).toBeVisible()
    }
    await page.keyboard.press('Escape')
  }
})

test('start flow reaches Builder and preserves local CV data across reload', async ({ page }) => {
  await page.goto('/')
  const { dialog } = await openEntryDialog(page)
  await dialog.getByRole('button', { name: /Start a new CV/ }).click()
  await expect(page).toHaveURL(/\/builder$/)

  const name = page.getByLabel('Full Name')
  await name.fill('A deliberately long profile name for responsive verification')
  await page.reload()
  await expect(name).toHaveValue('A deliberately long profile name for responsive verification')
})

test('fresh replacement remains explicit when local content exists', async ({ page }) => {
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill('Keep this CV')
  await page.locator('.brand-mini').click()
  const { dialog } = await openEntryDialog(page)
  await expect(dialog.getByRole('button', { name: /Continue current CV/ })).toBeVisible()

  page.once('dialog', (confirmation) => confirmation.dismiss())
  await dialog.getByRole('button', { name: /Start a new CV/ }).click()
  await expect(dialog).toBeVisible()

  page.once('dialog', (confirmation) => confirmation.accept())
  await dialog.getByRole('button', { name: /Start a new CV/ }).click()
  await expect(page).toHaveURL(/\/builder$/)
  await expect(page.getByLabel('Full Name')).toHaveValue('')
})

test('JSON export, cancellation, and restore preserve structured state', async ({ page }) => {
  await page.goto('/builder')
  const name = page.getByLabel('Full Name')
  await name.fill('JSON Backup Owner')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const download = await downloadPromise
  const backupPath = await download.path()
  expect(backupPath).not.toBeNull()
  const backupFile = {
    name: 'cvforge-backup.json',
    mimeType: 'application/json',
    buffer: await readFile(backupPath!),
  }

  await name.fill('Unsaved replacement')
  await page.getByRole('button', { name: 'Import' }).click()
  let fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await fileChooserPromise).setFiles(backupFile)
  await expect(page.getByText('Valid Backup Found')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.keyboard.press('Escape')
  await expect(name).toHaveValue('Unsaved replacement')

  await page.getByRole('button', { name: 'Import' }).click()
  fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await fileChooserPromise).setFiles(backupFile)
  await page.getByRole('button', { name: /Replace current CV/ }).click()
  await expect(name).toHaveValue('JSON Backup Owner')
})

test('downloaded CVForge PDF retains an embedded restorable session', async ({ page }) => {
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill('Embedded Session Owner')
  const downloadButton = page.getByRole('button', { name: 'Download' })
  await expect(downloadButton).toBeVisible({ timeout: 20_000 })

  const downloadPromise = page.waitForEvent('download')
  await downloadButton.click()
  const download = await downloadPromise
  const pdfPath = await download.path()
  expect(pdfPath).not.toBeNull()
  const pdfFile = {
    name: 'cvforge-session.pdf',
    mimeType: 'application/pdf',
    buffer: await readFile(pdfPath!),
  }

  await page.getByRole('button', { name: 'Import' }).click()
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await fileChooserPromise).setFiles(pdfFile)
  await expect(page.getByText('CVForge Session Detected')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('button', { name: 'Restore Embedded Session' })).toBeVisible()
})

test('external PDF import remains review-first and cancellation preserves Builder data', async ({ page }) => {
  const externalPdf = await PDFDocument.create()
  const font = await externalPdf.embedFont(StandardFonts.Helvetica)
  const pdfPage = externalPdf.addPage([595, 842])
  pdfPage.drawText('External Candidate', { x: 48, y: 790, size: 20, font })
  pdfPage.drawText('external@example.com', { x: 48, y: 760, size: 11, font })
  pdfPage.drawText('EXPERIENCE', { x: 48, y: 720, size: 13, font })
  pdfPage.drawText('Product Engineer | Example Co | 2022 - Present', {
    x: 48,
    y: 694,
    size: 11,
    font,
  })
  const externalPdfBytes = await externalPdf.save()

  await page.goto('/builder')
  const name = page.getByLabel('Full Name')
  await name.fill('Existing Builder Owner')
  await page.getByRole('button', { name: 'Import' }).click()
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await fileChooserPromise).setFiles({
    name: 'external-candidate.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(externalPdfBytes),
  })

  await expect(page.getByText('Best-Effort Draft Review')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('button', { name: 'Create Editable Draft' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.keyboard.press('Escape')
  await expect(name).toHaveValue('Existing Builder Owner')
})

test('focus recovers in both directions and cannot escape the active dialog', async ({ page }) => {
  await page.goto('/')
  const { dialog, trigger } = await openEntryDialog(page)
  const buttons = dialog.getByRole('button')
  const first = buttons.first()
  const last = buttons.last()

  await first.focus()
  await page.keyboard.press('Shift+Tab')
  await expect(last).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(first).toBeFocused()

  await page.evaluate(() => {
    document.body.tabIndex = -1
    document.body.focus()
  })
  await page.keyboard.press('Tab')
  await expect(first).toBeFocused()

  await first.evaluate((element: HTMLButtonElement) => {
    element.disabled = true
    element.focus()
  })
  await page.keyboard.press('Tab')
  await expect.poll(() => dialog.evaluate(
    (element) => element.contains(document.activeElement),
  )).toBe(true)

  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('Import replaces the entry dialog and returns focus to the parent control', async ({ page }) => {
  await page.goto('/')
  const { dialog: entryDialog, trigger } = await openEntryDialog(page)
  const importTrigger = entryDialog.getByRole('button', { name: /Restore or import/ })
  await importTrigger.click()

  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(page.getByRole('dialog', { name: 'Import CV Data' })).toBeVisible()
  await page.keyboard.press('Escape')

  const restoredEntry = page.getByRole('dialog', { name: 'Start with CVForge' })
  await expect(restoredEntry).toBeVisible()
  await expect(restoredEntry.getByRole('button', { name: /Restore or import/ })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('Builder and Parser expose unambiguous route-aware active modes', async ({ page }) => {
  await page.goto('/builder')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Builder' }))
    .toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Parser' }))
    .not.toHaveAttribute('aria-current', 'page')

  await page.goto('/parser')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Parser' }))
    .toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Builder' }))
    .not.toHaveAttribute('aria-current', 'page')
})

test('reduced motion suppresses the canvas while preserving the static atmosphere', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.ember-background')).toBeVisible()
  await expect(page.locator('.ember-canvas')).toHaveCSS('display', 'none')
  await expect(page.locator('.ember-background')).toHaveCSS('pointer-events', 'none')
})

test('deprecated resume import route reaches the supported Builder destination', async ({ page }) => {
  await page.goto('/resume-import')
  await expect(page).toHaveURL(/\/builder$/)
  await expect(page.getByRole('heading', { name: 'Craft your CV' })).toBeVisible()
})
