import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const LEGACY_HOST = 'cvforge.alexandreteixeira.dev'

// Resolve the previous production hostname to the local test server so the
// app runs on a separate origin with its own browser storage.
test.use({ launchOptions: { args: [`--host-resolver-rules=MAP ${LEGACY_HOST} 127.0.0.1`] } })

function legacyUrl(baseURL: string, path: string) {
  const port = new URL(baseURL).port
  return `http://${LEGACY_HOST}:${port}${path}`
}

test('the previous hostname explains the move and exports a backup the new origin imports', async ({ page, baseURL }) => {
  await page.goto(legacyUrl(baseURL!, '/builder'))
  const notice = page.getByRole('region', { name: /CVForge has moved to/ })
  await expect(notice).toBeVisible()
  await expect(notice.getByRole('button', { name: 'Download JSON backup' })).toHaveCount(0)

  await page.getByLabel('Full Name').fill('Legacy Origin Owner')
  await expect(notice.getByRole('button', { name: 'Download JSON backup' })).toBeVisible()
  const download = page.waitForEvent('download')
  await notice.getByRole('button', { name: 'Download JSON backup' }).click()
  const backup = await readFile((await (await download).path())!)
  expect(JSON.parse(backup.toString('utf8')).resume.profile.name).toBe('Legacy Origin Owner')

  const openLink = notice.getByRole('link', { name: /^Open / })
  expect(await openLink.getAttribute('href')).toMatch(/^https?:\/\/[^/]+\/builder$/)
  expect(await openLink.getAttribute('href')).not.toContain(LEGACY_HOST)

  // The current origin has separate storage: the CV is absent until imported.
  await page.goto('/builder')
  await expect(page.getByLabel('Full Name')).toHaveValue('')
  await expect(page.getByRole('region', { name: /CVForge has moved to/ })).toHaveCount(0)
  await page.getByRole('button', { name: 'Import' }).click()
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await chooser).setFiles({ name: 'legacy-backup.json', mimeType: 'application/json', buffer: backup })
  await page.getByRole('button', { name: /Replace current CV/ }).click()
  await expect(page.getByLabel('Full Name')).toHaveValue('Legacy Origin Owner')
})

test('the previous hostname is not redirected and keeps its saved CV', async ({ page, baseURL }) => {
  await page.goto(legacyUrl(baseURL!, '/builder'))
  await page.getByLabel('Full Name').fill('Stays At Legacy Origin')
  await page.reload()
  expect(new URL(page.url()).hostname).toBe(LEGACY_HOST)
  await expect(page.getByLabel('Full Name')).toHaveValue('Stays At Legacy Origin')
})
