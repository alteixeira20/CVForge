import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { PDFDocument } from 'pdf-lib'
import {
  cvPayload,
  expectContinuous,
  firstPageSignature,
  openBuilderWithCV,
  previewCanvases,
  showEditPanel,
  showPreviewPanel,
  startFrameSampler,
  stopFrameSampler,
  waitForFirstPreview,
} from './support/previewFixtures'

const FIRST_PREVIEW_WIDTHS = [1440, 1024, 768, 390, 320] as const
const DOCUMENT_SIZES = ['A4', 'Letter'] as const

function record(name: string, value: unknown) {
  test.info().annotations.push({ type: name, description: JSON.stringify(value) })
  console.log(`[preview-metric] ${test.info().title} :: ${name} = ${JSON.stringify(value)}`)
}

async function expectPagesInsideContainer(page: Page) {
  const layout = await page.evaluate(() => {
    const scroller = document.querySelector<HTMLElement>('.canvas')!
    const canvas = scroller.querySelector('canvas')!
    const style = getComputedStyle(scroller)
    const contentWidth = scroller.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    return {
      pageWidth: canvas.getBoundingClientRect().width,
      contentWidth,
      scrollOverflow: scroller.scrollWidth - scroller.clientWidth,
    }
  })
  expect(layout.pageWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.contentWidth + 1)
  expect(layout.pageWidth).toBeGreaterThan(layout.contentWidth * 0.8)
  expect(layout.scrollOverflow, JSON.stringify(layout)).toBeLessThanOrEqual(1)
}

async function waitForSignatureChange(page: Page, previous: string) {
  const started = Date.now()
  await expect.poll(() => firstPageSignature(page), { timeout: 15_000, intervals: [50] })
    .not.toBe(previous)
  return Date.now() - started
}

async function pageWidth(page: Page) {
  return previewCanvases(page).first().evaluate((canvas) => canvas.getBoundingClientRect().width)
}

function previewToolbar(page: Page) {
  return page.getByRole('toolbar', { name: 'PDF preview controls' })
}

for (const documentSize of DOCUMENT_SIZES) {
  for (const width of FIRST_PREVIEW_WIDTHS) {
    test(`first preview is visible and fits at ${width}px for ${documentSize}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 })
      const started = Date.now()
      await openBuilderWithCV(page, cvPayload({ documentSize }))
      await showPreviewPanel(page)
      await waitForFirstPreview(page)
      record('timeToFirstPreviewMs', Date.now() - started)
      await expectPagesInsideContainer(page)
    })
  }
}

test('typing keeps the preview continuously visible and updates it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)
  const before = await firstPageSignature(page)

  await startFrameSampler(page)
  const summary = page.getByLabel('Professional Summary')
  await summary.click()
  await summary.press('End')
  await summary.pressSequentially(' Updated with new metrics.', { delay: 60 })
  const latencyMs = await waitForSignatureChange(page, before)
  await page.waitForTimeout(600)
  const frames = await stopFrameSampler(page)

  record('lastKeystrokeToUpdatedPreviewMs', latencyMs)
  record('frames', frames)
  expectContinuous(frames)
})

test('rapid typing on a multi-page CV keeps pages visible and settles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page, cvPayload({ pages: 'many' }))
  await waitForFirstPreview(page)
  const before = await firstPageSignature(page)
  const longTasks = await page.evaluate(() => {
    const entries: number[] = []
    new PerformanceObserver((list) => list.getEntries().forEach((entry) => entries.push(entry.duration)))
      .observe({ type: 'longtask', buffered: false })
    ;(window as unknown as { __longTasks: number[] }).__longTasks = entries
    return true
  })
  expect(longTasks).toBe(true)

  await startFrameSampler(page)
  const summary = page.getByLabel('Professional Summary')
  for (let index = 0; index < 12; index += 1) {
    await summary.fill(`Revised summary ${index} with accented names: café, naïve, résumé.`)
  }
  const latencyMs = await waitForSignatureChange(page, before)
  await page.waitForTimeout(800)
  const frames = await stopFrameSampler(page)
  const tasks = await page.evaluate(() => (window as unknown as { __longTasks: number[] }).__longTasks)

  record('lastKeystrokeToUpdatedPreviewMs', latencyMs)
  record('longTasks', { count: tasks.length, totalMs: Math.round(tasks.reduce((a, b) => a + b, 0)), maxMs: Math.round(Math.max(0, ...tasks)) })
  record('frames', frames)
  expect(await previewCanvases(page).count()).toBeGreaterThanOrEqual(3)
  expectContinuous(frames)
})

test('resizing never replaces valid pages with the loading screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)

  await startFrameSampler(page)
  for (const width of [1360, 1280, 1200, 1100, 1024, 1180, 1300, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(1500)
  const frames = await stopFrameSampler(page)

  record('frames', frames)
  expectContinuous(frames)
  await expectPagesInsideContainer(page)
})

test('resizing a narrow mobile preview keeps pages visible and fitted', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 })
  await openBuilderWithCV(page)
  await showPreviewPanel(page)
  await waitForFirstPreview(page)

  await startFrameSampler(page)
  for (const width of [400, 375, 340, 320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(1500)
  const frames = await stopFrameSampler(page)

  record('frames', frames)
  expectContinuous(frames)
  await expectPagesInsideContainer(page)
})

test('mobile Edit and Preview switching keeps the preview and editor state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openBuilderWithCV(page)
  const editorScroller = page.locator('.workbench-panel-editor .overflow-y-auto').first()
  await editorScroller.evaluate((element) => { element.scrollTop = 400 })
  const editorScrollTop = await editorScroller.evaluate((element) => element.scrollTop)

  await showPreviewPanel(page)
  await waitForFirstPreview(page)
  await showEditPanel(page)
  await expect(page.getByLabel('Full Name')).toBeAttached()
  expect(await editorScroller.evaluate((element) => element.scrollTop)).toBe(editorScrollTop)

  const switchStarted = Date.now()
  await startFrameSampler(page)
  await showPreviewPanel(page)
  await expect.poll(() => firstPageSignature(page), { intervals: [16] }).not.toBe('')
  const visibleAfterMs = Date.now() - switchStarted
  await page.waitForTimeout(1200)
  const frames = await stopFrameSampler(page)

  record('previewVisibleAfterSwitchMs', visibleAfterMs)
  record('frames', frames)
  expect(visibleAfterMs).toBeLessThan(500)
  expect(frames.framesWithLoader).toBe(0)
  expect(frames.framesWithBlankPage).toBe(0)
})

test('zoom and Fit resize pages immediately without the loading screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)
  const toolbar = previewToolbar(page)
  const fitWidth = await pageWidth(page)
  await expect(toolbar.getByRole('button', { name: 'Fit PDF preview to panel' })).toHaveAttribute('aria-pressed', 'true')

  await startFrameSampler(page)
  await toolbar.getByRole('button', { name: 'Zoom in PDF preview' }).click()
  await expect.poll(() => pageWidth(page)).toBeGreaterThan(fitWidth * 1.1)
  await expect(toolbar.getByRole('button', { name: 'Fit PDF preview to panel' })).toHaveAttribute('aria-pressed', 'false')
  await toolbar.getByRole('button', { name: 'Zoom out PDF preview' }).click()
  await toolbar.getByRole('button', { name: 'Zoom out PDF preview' }).click()
  await expect.poll(() => pageWidth(page)).toBeLessThan(fitWidth)
  await toolbar.getByRole('button', { name: 'Fit PDF preview to panel' }).click()
  await expect.poll(() => pageWidth(page)).toBeCloseTo(fitWidth, 0)
  await page.waitForTimeout(1200)
  const frames = await stopFrameSampler(page)

  record('frames', frames)
  expectContinuous(frames)
  await expect(toolbar.getByRole('button', { name: 'Fit PDF preview to panel' })).toHaveAttribute('aria-pressed', 'true')
  await expectPagesInsideContainer(page)
})

test('a failed update keeps pages visible, reports the failure, and recovers on Retry', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)
  const before = await firstPageSignature(page)

  // Simulate a crashed pdf.js worker: it stops answering without an error.
  const workers = page.workers()
  expect(workers.length).toBeGreaterThan(0)
  await Promise.all(workers.map((worker) => worker.evaluate(() => self.close()).catch(() => undefined)))
  await startFrameSampler(page)
  await page.getByLabel('Professional Summary').fill('Text whose preview update is forced to fail.')
  const status = page.getByRole('status').filter({ hasText: 'Preview could not be updated' })
  await expect(status).toBeVisible({ timeout: 20_000 })
  const retry = page.getByRole('button', { name: 'Retry preview' })
  await expect(retry).toBeVisible()
  expect(await firstPageSignature(page)).toBe(before)

  await retry.click()
  await waitForSignatureChange(page, before)
  await expect(status).toHaveCount(0)
  const frames = await stopFrameSampler(page)

  record('frames', frames)
  expectContinuous(frames)
})

test('pending updates are announced without hiding the current pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)
  await page.getByLabel('Professional Summary').fill('Summary changed to observe the updating status.')
  await expect(page.getByRole('status').filter({ hasText: 'Updating preview' })).toBeVisible()
  await expect(previewCanvases(page).first()).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'Updating preview' })).toHaveCount(0, { timeout: 15_000 })
})

test.describe('compact preview toolbar', () => {
  test.use({ deviceScaleFactor: 2 })

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 640, height: 400 },
  ]) {
    test(`every control is reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await openBuilderWithCV(page)
      await showPreviewPanel(page)
      await waitForFirstPreview(page)
      const toolbar = previewToolbar(page)
      // The Download button loads lazily; count only once it has replaced its placeholder.
      await expect(toolbar.getByRole('button', { name: 'Download' })).toBeVisible()
      const controls = toolbar.locator('button, a')
      const count = await controls.count()
      expect(count).toBeGreaterThanOrEqual(5)
      for (let index = 0; index < count; index += 1) {
        const control = controls.nth(index)
        const box = (await control.boundingBox())!
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.y).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
        if (await control.isEnabled()) await control.click({ trial: true, timeout: 2_000 })
      }
    })
  }
})

test('preview toolbar is labelled and has no serious axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openBuilderWithCV(page)
  await waitForFirstPreview(page)
  const toolbar = previewToolbar(page)
  await expect(toolbar.getByRole('button', { name: 'Zoom in PDF preview' })).toBeVisible()
  await expect(toolbar.getByRole('button', { name: 'Zoom out PDF preview' })).toBeVisible()
  await expect(toolbar.getByRole('button', { name: 'Fit PDF preview to panel' })).toBeVisible()
  await expect(toolbar.getByText(/^\d+%$/)).toBeVisible()

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const serious = result.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target.join(' ')) }))
  expect(serious).toEqual([])
})

test('multi-page preview matches the downloaded PDF page count', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openBuilderWithCV(page, cvPayload({ pages: 'many' }))
  await waitForFirstPreview(page)
  const previewPages = await previewCanvases(page).count()
  expect(previewPages).toBeGreaterThanOrEqual(3)

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download' }).click()
  const file = await download
  const pdf = await PDFDocument.load(await readFile((await file.path())!))
  record('pages', { preview: previewPages, download: pdf.getPageCount() })
  expect(pdf.getPageCount()).toBe(previewPages)
})
