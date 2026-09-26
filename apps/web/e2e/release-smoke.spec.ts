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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build, analyze, and improve your CV')
  await expect(page.locator('.site-header').getByRole('link', { name: 'Builder' })).toBeVisible()
  await expect(page.locator('.site-header').getByRole('link', { name: 'Analyzer' })).toBeVisible()
  await expect(page.locator('.site-header').getByRole('link', { name: 'Source', exact: true })).toHaveCount(0)
  await expect(page.locator('.site-header').getByRole('link', { name: /Open GitHub to star/ })).toBeVisible()
  await expect(page.locator('.site-header').getByRole('button', { name: 'Build your CV' })).toBeVisible()
  await expect(page.locator('.site-header-inner')).toHaveCSS('max-width', '1120px')
  expect(errors).toEqual([])
})

test('homepage, Builder, and Analyzer do not overflow the acceptance viewports', async ({ page }) => {
  for (const viewport of RESPONSIVE_VIEWPORTS) {
    await page.setViewportSize(viewport)
    for (const route of ['/', '/builder', '/analyzer']) {
      await page.goto(route)
      await expectNoHorizontalOverflow(page)
    }
  }
})

test('homepage header keeps the primary journey usable at every acceptance viewport', async ({ page }) => {
  for (const viewport of RESPONSIVE_VIEWPORTS) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const header = page.locator('.site-header')
    await expect(header.getByRole('link', { name: 'Builder' })).toBeVisible()
    await expect(header.getByRole('link', { name: 'Analyzer' })).toBeVisible()
    await expect(header.getByRole('link', { name: /Open GitHub to star/ })).toBeVisible()
    await expect(header.getByRole('button', { name: /Build (your )?CV/ })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  }
})

test('desktop header is constrained and exposes the complete navigation and action set', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const header = page.locator('.site-header')
  const inner = page.locator('.site-header-inner')
  const headerBox = await header.boundingBox()
  const innerBox = await inner.boundingBox()
  expect(headerBox).not.toBeNull()
  expect(innerBox).not.toBeNull()
  expect(innerBox!.width).toBeLessThan(headerBox!.width)
  expect(innerBox!.width).toBeLessThanOrEqual(1120)

  await expect(header.getByRole('link', { name: 'Builder' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Analyzer' })).toHaveAttribute('href', '/analyzer')
  await expect(header.getByRole('link', { name: 'Source', exact: true })).toHaveCount(0)
  const star = header.getByRole('link', { name: /Open GitHub to star/ })
  await expect(star).toHaveAttribute('href', 'https://github.com/alteixeira20/CVForge')
  await expect(star).toHaveAttribute('target', '_blank')
  await expect(star).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(star.locator('svg')).toBeVisible()
  await expect(header.getByRole('button', { name: 'Build your CV' })).toBeVisible()
})

test('hero trust facts are visible before scrolling on desktop acceptance viewports', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const trustRow = page.locator('.hero .meta-row')
    await expect(trustRow).toBeVisible()
    const box = await trustRow.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height)
    await expect(page.locator('.preview-bar')).toBeVisible()
  }
})

test('Analyze CV reaches the canonical Analyzer route', async ({ page }) => {
  await page.goto('/')
  await page.locator('.hero').getByRole('link', { name: 'Analyze CV' }).click()
  await expect(page).toHaveURL(/\/analyzer$/)
  await expect(page.getByRole('heading', { name: 'Analyze your CV' })).toBeVisible()
})

test('the legacy Parser route permanently redirects to Analyzer', async ({ request }) => {
  const response = await request.get('/parser', { maxRedirects: 0 })
  expect(response.status()).toBe(308)
  expect(response.headers().location).toBe('/analyzer')
})

test('prominent button interaction moves the complete surface and respects reduced motion', async ({ page }) => {
  await page.goto('/')
  const button = page.locator('.hero').getByRole('button', { name: 'Build your CV' })
  await button.hover()
  const hoverState = await button.evaluate((element) => ({
    transform: getComputedStyle(element).transform,
    childTransforms: Array.from(element.children).map((child) => getComputedStyle(child).transform),
  }))
  expect(hoverState.transform).not.toBe('none')
  expect(hoverState.childTransforms.every((transform) => transform === 'none')).toBe(true)

  await button.focus()
  await expect(button).toBeFocused()
  expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  const reducedButton = page.locator('.hero').getByRole('button', { name: 'Build your CV' })
  await reducedButton.hover()
  await expect(reducedButton).toHaveCSS('transform', 'none')
})

test('homepage preview communicates a complete fictional CV and practical Analyzer signals', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByText('Maya Chen', { exact: true })).toBeVisible()
  await expect(page.getByText('Northstar Works', { exact: false })).toBeVisible()
  await expect(page.getByText('Juniper Studio', { exact: false })).toBeVisible()
  await expect(page.getByText('Open Metrics Toolkit', { exact: true })).toBeVisible()
  await expect(page.getByText('Extraction quality', { exact: true })).toBeVisible()
  await expect(page.getByText('Structure completeness', { exact: true })).toBeVisible()
  await expect(page.getByText('Improve first', { exact: true })).toBeVisible()
  await expect(page.getByText('Diagnostics are practical signals, not hiring guarantees.')).toHaveCount(0)
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
  await page.getByRole('button', { name: 'Restore Embedded Session' }).click()
  await expect(page.getByLabel('Full Name')).toHaveValue('Embedded Session Owner')
  await page.reload()
  await expect(page.getByLabel('Full Name')).toHaveValue('Embedded Session Owner')
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

  await page.getByRole('button', { name: 'Import' }).click()
  const confirmChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await confirmChooser).setFiles({
    name: 'external-candidate.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(externalPdfBytes),
  })
  await expect(page.getByText('Best-Effort Draft Review')).toBeVisible({ timeout: 20_000 })
  await page.getByRole('button', { name: 'Create Editable Draft' }).click()
  await expect(page.getByLabel('Full Name')).toHaveValue('External Candidate')
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

test('Builder and Analyzer expose unambiguous route-aware active modes', async ({ page }) => {
  await page.goto('/builder')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Builder' }))
    .toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Analyzer' }))
    .not.toHaveAttribute('aria-current', 'page')

  await page.goto('/analyzer')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Analyzer' }))
    .toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.app-header').getByRole('link', { name: 'Builder' }))
    .not.toHaveAttribute('aria-current', 'page')
})

test('Analyzer scoring is multidimensional, prioritized, explainable, and deterministic', async ({ page }) => {
  await page.goto('/analyzer')
  await expect(page.getByText('ATS-Style CV Analysis', { exact: true })).toBeVisible()
  await expect(page.locator('[data-analysis-dimension="completeness"]')).toBeVisible()
  await expect(page.locator('[data-analysis-dimension="structure"]')).toBeVisible()
  await expect(page.locator('[data-analysis-dimension="clarity"]')).toBeVisible()
  await expect(page.locator('[data-analysis-dimension="impact"]')).toBeVisible()
  await expect(page.locator('[data-analysis-dimension="ats-compatibility"]')).toBeVisible()
  await expect(page.getByText('high priority', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Why it matters:', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Improve:', { exact: true }).first()).toBeVisible()

  const scoreBefore = await page.locator('[data-analysis-dimension]').evaluateAll((elements) => (
    elements.map((element) => element.textContent)
  ))
  await page.reload()
  const scoreAfter = await page.locator('[data-analysis-dimension]').evaluateAll((elements) => (
    elements.map((element) => element.textContent)
  ))
  expect(scoreAfter).toEqual(scoreBefore)
})

test('Analyzer accepts PDF only and reports image-only extraction honestly', async ({ page }) => {
  await page.goto('/analyzer')
  const input = page.locator('input[type="file"]')

  await input.setInputFiles({
    name: 'candidate.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Plain text CV'),
  })
  const analysisAlert = page.locator('p[role="alert"]')
  await expect(analysisAlert).toContainText('currently analyzes PDF files only')
  await expect(analysisAlert).toContainText('DOCX and plain-text analysis are not supported')

  const scannedPdf = await PDFDocument.create()
  scannedPdf.addPage([595, 842])
  await input.setInputFiles({
    name: 'scanned-candidate.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(await scannedPdf.save()),
  })
  await expect(analysisAlert).toContainText('No selectable text was found', { timeout: 20_000 })
  await expect(analysisAlert).toContainText('does not send the file to a cloud OCR service')
})

test('page metadata is unique, canonical, social-ready, and paired with one H1', async ({ page }) => {
  const results: Array<{ route: string; title: string; description: string }> = []
  for (const route of ['/', '/builder', '/analyzer']) {
    await page.goto(route)
    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    const canonicalUrl = new URL(canonical!)

    expect(title.length).toBeGreaterThan(20)
    expect(description?.length).toBeGreaterThan(70)
    expect(canonicalUrl.pathname).toBe(route)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!)
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1)
    results.push({ route, title, description: description! })
  }

  expect(new Set(results.map((result) => result.title)).size).toBe(results.length)
  expect(new Set(results.map((result) => result.description)).size).toBe(results.length)
})

test('homepage JSON-LD parses and uses the canonical CVForge URL', async ({ page }) => {
  await page.goto('/')
  const rawJson = await page.locator('script[type="application/ld+json"]').textContent()
  const structuredData = JSON.parse(rawJson!)
  expect(structuredData['@context']).toBe('https://schema.org')
  expect(structuredData['@graph'].map((entry: { '@type': string }) => entry['@type']))
    .toEqual(['Organization', 'WebSite', 'SoftwareApplication'])

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  const software = structuredData['@graph'].find(
    (entry: { '@type': string }) => entry['@type'] === 'SoftwareApplication',
  )
  expect(software.url).toBe(new URL(canonical!).origin)
  expect(software.image).toBe(`${new URL(canonical!).origin}/opengraph-image`)
})

test('robots, sitemap, manifest, and social image routes are valid', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBe(true)
  const robotsText = await robots.text()
  expect(robotsText).toContain('User-Agent: *')
  expect(robotsText).toContain('Allow: /')

  const sitemapDirective = robotsText.match(/^Sitemap:\s+(\S+)$/m)?.[1]
  expect(sitemapDirective).toBeTruthy()

  const expectedOrigin = new URL(sitemapDirective!).origin
  expect(sitemapDirective).toBe(`${expectedOrigin}/sitemap.xml`)
  expect(robotsText).toContain(`Host: ${expectedOrigin}`)

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBe(true)
  const sitemapText = await sitemap.text()
  expect(sitemapText).toContain(`<loc>${expectedOrigin}/</loc>`)
  expect(sitemapText).toContain(`<loc>${expectedOrigin}/builder</loc>`)
  expect(sitemapText).toContain(`<loc>${expectedOrigin}/analyzer</loc>`)
  expect(sitemapText).not.toContain('/parser')
  expect(sitemapText).not.toContain('/resume-import')

  const manifest = await request.get('/site.webmanifest')
  expect(manifest.ok()).toBe(true)
  expect(await manifest.json()).toMatchObject({
    name: 'CVForge',
    start_url: '/',
  })

  const socialImage = await request.get('/opengraph-image')
  expect(socialImage.ok()).toBe(true)
  expect(socialImage.headers()['content-type']).toContain('image/png')
  expect((await socialImage.body()).byteLength).toBeGreaterThan(10_000)
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
