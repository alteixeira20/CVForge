import { expect, test } from '@playwright/test'

// Runs when the build origin is known (make release-check exports it). CI's
// placeholder origin is covered by the origin-agnostic release-smoke tests.
const EXPECTED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
const RETIRED_HOSTNAME = 'cvforge.alexandreteixeira.dev'

test.skip(!EXPECTED_ORIGIN, 'NEXT_PUBLIC_SITE_URL is not set for this run')

test('pages embed the production origin in canonical, social, and structured metadata', async ({ page }) => {
  for (const route of ['/', '/builder', '/analyzer']) {
    await page.goto(route)
    const expectedUrl = route === '/' ? `${EXPECTED_ORIGIN}` : `${EXPECTED_ORIGIN}${route}`
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical?.replace(/\/$/, '')).toBe(expectedUrl)
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    expect(ogUrl?.replace(/\/$/, '')).toBe(expectedUrl)
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content')
    expect(ogImage).toMatch(new RegExp(`^${EXPECTED_ORIGIN!.replace(/[.]/g, '\\.')}/opengraph-image`))
    const twitterImage = await page.locator('meta[name="twitter:image"]').first().getAttribute('content')
    expect(twitterImage).toMatch(new RegExp(`^${EXPECTED_ORIGIN!.replace(/[.]/g, '\\.')}/opengraph-image`))
    expect(await page.content()).not.toContain(RETIRED_HOSTNAME)
  }
  await page.goto('/')
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(jsonLd).toContain(`"url":"${EXPECTED_ORIGIN}"`)
})

test('robots.txt and sitemap.xml use the production origin', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain(`Host: ${EXPECTED_ORIGIN}`)
  expect(robots).toContain(`Sitemap: ${EXPECTED_ORIGIN}/sitemap.xml`)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/', '/builder', '/analyzer']) {
    expect(sitemap).toContain(`<loc>${EXPECTED_ORIGIN}${path}</loc>`)
  }
  expect(`${robots}${sitemap}`).not.toContain(RETIRED_HOSTNAME)
})
