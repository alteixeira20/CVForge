import { expect, test, type Page } from '@playwright/test'
import { cvPayload, LONG_URL, openBuilderWithCV, waitForFirstPreview } from './support/previewFixtures'
import { downloadBuilderPdf, extractPdf, joinWrapped } from './support/pdfText'

const SUPPORTED_TEXT = 'Zoë Brontë, café, naïve, Ångström, Straße, “quotes”, ‘single’, • bullet, … and €'

const UNSUPPORTED_SCRIPTS = {
  polish: 'Łukasz Żółć',
  greek: 'Αθήνα',
  cyrillic: 'Москва',
  cjk: '東京',
  emoji: 'Launched 🚀',
}

async function openWithSummary(page: Page, summary: string, pages: 'one' | 'many' = 'one') {
  const payload = JSON.parse(cvPayload({ pages }))
  payload.resume.profile.summary = summary
  await openBuilderWithCV(page, JSON.stringify(payload))
  await waitForFirstPreview(page)
}

function characterNotice(page: Page) {
  return page.getByRole('status').filter({ hasText: 'Some characters cannot be shown in the PDF' })
}

test('Western European text and typographic punctuation export exactly', async ({ page }) => {
  await openWithSummary(page, SUPPORTED_TEXT)
  await expect(characterNotice(page)).toHaveCount(0)
  const pdf = await extractPdf(await downloadBuilderPdf(page))
  expect(pdf.lines).toContain(SUPPORTED_TEXT)
})

for (const [script, sample] of Object.entries(UNSUPPORTED_SCRIPTS)) {
  test(`${script} text renders without errors and is disclosed before download`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await openWithSummary(page, sample)
    await expect(characterNotice(page)).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Preview could not be updated' })).toHaveCount(0)
    const pdf = await extractPdf(await downloadBuilderPdf(page))
    expect(pdf.lines.length).toBeGreaterThan(5)
    expect(errors).toEqual([])
  })
}

test('a long URL stays inside the page and extracts in full', async ({ page }) => {
  await openWithSummary(page, 'Portfolio below.', 'many')
  const pdf = await extractPdf(await downloadBuilderPdf(page))
  const displayedUrl = LONG_URL.replace(/^https:\/\//, '')
  expect(joinWrapped(pdf.lines)).toContain(displayedUrl)
  expect(pdf.maxRight).toBeLessThanOrEqual(pdf.pageWidth)
})

test('an unbreakable token wraps inside the page instead of being clipped', async ({ page }) => {
  const token = 'https://example.org/' + 'A1b2C3d4E5f6G7h8'.repeat(9)
  await openWithSummary(page, `Portfolio: ${token}`)
  const pdf = await extractPdf(await downloadBuilderPdf(page))
  expect(joinWrapped(pdf.lines)).toContain(token)
  expect(pdf.maxRight).toBeLessThanOrEqual(pdf.pageWidth)
})
