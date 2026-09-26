import { expect, type Page } from '@playwright/test'
import { CV_STATE_KEY, seedStorage } from './cvStorage'

type DocumentSize = 'A4' | 'Letter'

export const LONG_URL =
  'https://example.org/portfolio/projects/distributed-systems/observability/' +
  'final-performance-and-reliability-report-2026?version=complete&section=technical-appendices'

function workItem(index: number) {
  return {
    id: `work-${index}`,
    company: `Example Organization ${index}`,
    role: 'Senior Software Engineer',
    location: 'London, United Kingdom',
    startDate: '2019-01',
    endDate: '2023-06',
    isCurrent: false,
    bullets: [
      'Led the migration of critical services with zero data loss and improved reliability by 35%.',
      'Designed continuous integration pipelines that cut delivery time from hours to minutes.',
      'Mentored a team of five and documented accessible review practices for the whole organization.',
      'Coordinated platform observability with actionable alerts and shared dashboards.',
    ],
  }
}

export function cvPayload(options: { pages?: 'one' | 'many', documentSize?: DocumentSize } = {}) {
  const workCount = options.pages === 'many' ? 16 : 1
  return JSON.stringify({
    schemaVersion: '1.0.0',
    updatedAt: '2026-09-26T00:00:00.000Z',
    resume: {
      profile: {
        name: 'Zoë Brontë-Smith',
        email: 'zoe@example.org',
        phone: '+44 20 7946 0000',
        location: 'London',
        website: options.pages === 'many' ? LONG_URL : '',
        summary: 'Engineer focused on reliable, accessible, and measurable systems.',
      },
      workExperience: Array.from({ length: workCount }, (_, index) => workItem(index + 1)),
      skills: { technical: ['TypeScript', 'React', 'PostgreSQL'], soft: ['Communication'] },
    },
    settings: {
      documentSize: options.documentSize ?? 'A4',
      visibleSections: {},
      bulletVisibility: {},
    },
  })
}

export async function openBuilderWithCV(page: Page, payload = cvPayload()) {
  await seedStorage(page, { [CV_STATE_KEY]: payload })
  await page.goto('/builder')
  await expect(page.getByLabel('Full Name')).not.toHaveValue('')
}

export async function showPreviewPanel(page: Page) {
  const nav = page.locator('.workbench-mobile-nav')
  if (await nav.isVisible()) await nav.getByRole('button', { name: 'Preview' }).click()
}

export async function showEditPanel(page: Page) {
  await page.locator('.workbench-mobile-nav').getByRole('button', { name: 'Edit' }).click()
}

export function previewCanvases(page: Page) {
  return page.locator('.canvas canvas')
}

export async function waitForFirstPreview(page: Page) {
  await expect(previewCanvases(page).first()).toBeVisible({ timeout: 20_000 })
  await expect.poll(() => firstPageSignature(page), { timeout: 20_000 }).not.toBe('')
}

// Content fingerprint of the first page: a rolling hash over every pixel.
// Empty string means no canvas or no painted pixels.
export function firstPageSignature(page: Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.canvas canvas')
    if (!canvas || canvas.width === 0) return ''
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return ''
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let painted = false
    let hash = 2166136261
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) painted = true
      hash = Math.imul(hash ^ (data[i] + (data[i + 1] << 8) + (data[i + 2] << 16)), 16777619)
    }
    return painted ? `${canvas.width}x${canvas.height}:${hash >>> 0}` : ''
  })
}

export interface FrameSummary {
  frames: number
  framesWithoutPages: number
  framesWithLoader: number
  framesWithBlankPage: number
  loaderTexts: string[]
}

// Samples every animation frame: whether preview pages are visible, whether
// the blocking loader is shown, and whether the first page is unpainted.
export async function startFrameSampler(page: Page) {
  await page.evaluate(() => {
    type Sample = { pages: number, loader: string, blank: boolean }
    const state = { samples: [] as Sample[], running: true }
    ;(window as unknown as { __previewSampler: typeof state }).__previewSampler = state
    const loaderText = () => {
      const statusNodes = Array.from(document.querySelectorAll('.canvas [role="status"]'))
      const loader = statusNodes.find((node) => /Preparing document|Rendering page/.test(node.textContent ?? ''))
      return loader?.textContent ?? ''
    }
    const isBlank = (canvas: HTMLCanvasElement | undefined) => {
      if (!canvas || canvas.width === 0) return true
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      const pixel = ctx?.getImageData(Math.floor(canvas.width / 2), 2, 1, 1).data
      return !pixel || pixel[3] === 0
    }
    const tick = () => {
      if (!state.running) return
      const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('.canvas canvas'))
        .filter((canvas) => canvas.getBoundingClientRect().width > 0)
      state.samples.push({ pages: canvases.length, loader: loaderText(), blank: isBlank(canvases[0]) })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

export async function stopFrameSampler(page: Page): Promise<FrameSummary> {
  return page.evaluate(() => {
    const state = (window as unknown as {
      __previewSampler: { samples: { pages: number, loader: string, blank: boolean }[], running: boolean }
    }).__previewSampler
    state.running = false
    const samples = state.samples
    return {
      frames: samples.length,
      framesWithoutPages: samples.filter((sample) => sample.pages === 0).length,
      framesWithLoader: samples.filter((sample) => sample.loader !== '').length,
      framesWithBlankPage: samples.filter((sample) => sample.pages > 0 && sample.blank).length,
      loaderTexts: Array.from(new Set(samples.map((sample) => sample.loader).filter(Boolean))),
    }
  })
}

export function expectContinuous(summary: FrameSummary) {
  expect(summary.frames).toBeGreaterThan(10)
  expect(summary, JSON.stringify(summary)).toMatchObject({
    framesWithoutPages: 0,
    framesWithLoader: 0,
    framesWithBlankPage: 0,
  })
}
