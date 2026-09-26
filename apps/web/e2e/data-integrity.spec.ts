import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  CV_RECOVERY_KEY,
  CV_STATE_KEY,
  readStorage,
  savedProfileName,
  seedStorage,
} from './support/cvStorage'

const CORRUPT_PAYLOAD = '{"resume":{"profile":{"name":"Corrupt Owner"'

async function currentStatePayload(page: Page, name: string) {
  await seedStorage(page, {})
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill(name)
  await expect.poll(() => savedProfileName(page)).toBe(name)
  return (await readStorage(page, CV_STATE_KEY))!
}

// A payload a newer CVForge build could have written before a rollback.
async function futurePayload(page: Page) {
  const current = JSON.parse(await currentStatePayload(page, 'Future Owner'))
  return JSON.stringify({ ...current, schemaVersion: '2.0.0', futureOnlyField: { kept: true } })
}

function notice(page: Page) {
  return page.getByRole('alert').filter({ has: page.locator('#saved-data-notice-title') })
}

test('corrupt saved data is never overwritten by edits or reloads', async ({ page }) => {
  await seedStorage(page, { [CV_STATE_KEY]: CORRUPT_PAYLOAD })
  await page.goto('/builder')
  await expect(notice(page)).toContainText('Your saved CV could not be opened')

  await page.getByLabel('Full Name').fill('Accidental Edit')
  await page.getByLabel('Full Name').press('End')
  await page.waitForTimeout(500)
  expect(await readStorage(page, CV_STATE_KEY)).toBe(CORRUPT_PAYLOAD)
  expect(await readStorage(page, CV_RECOVERY_KEY)).toBe(CORRUPT_PAYLOAD)

  await page.reload()
  await expect(notice(page)).toBeVisible()
  expect(await readStorage(page, CV_STATE_KEY)).toBe(CORRUPT_PAYLOAD)
})

test('corrupt saved data can be downloaded byte-for-byte', async ({ page }) => {
  await seedStorage(page, { [CV_STATE_KEY]: CORRUPT_PAYLOAD })
  await page.goto('/builder')
  const download = page.waitForEvent('download')
  await notice(page).getByRole('button', { name: 'Download saved data' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('cvforge-saved-data.json')
  expect(await readFile((await file.path())!, 'utf8')).toBe(CORRUPT_PAYLOAD)
})

test('a newer-schema CV survives a deployment rollback, edits, and reloads', async ({ page }) => {
  const payload = await futurePayload(page)
  await seedStorage(page, { [CV_STATE_KEY]: payload })
  await page.goto('/builder')
  await expect(notice(page)).toContainText('saved by a newer version of CVForge')
  await expect(notice(page).getByRole('button', { name: 'Reload' })).toBeVisible()
  await expect(page.getByLabel('Full Name')).toHaveValue('')

  await page.getByLabel('Full Name').fill('Older Build Edit')
  await page.waitForTimeout(500)
  expect(await readStorage(page, CV_STATE_KEY)).toBe(payload)

  await notice(page).getByRole('button', { name: 'Reload' }).click()
  await expect(notice(page)).toBeVisible()
  expect(await readStorage(page, CV_STATE_KEY)).toBe(payload)
  expect(await readStorage(page, CV_RECOVERY_KEY)).toBe(payload)
})

test('the analyzer also refuses to overwrite unreadable saved data', async ({ page }) => {
  await seedStorage(page, { [CV_STATE_KEY]: CORRUPT_PAYLOAD })
  await page.goto('/analyzer')
  await expect(notice(page)).toBeVisible()
  expect(await readStorage(page, CV_STATE_KEY)).toBe(CORRUPT_PAYLOAD)
})

test('start fresh replaces unreadable data only after confirmation and keeps a recovery copy', async ({ page }) => {
  await seedStorage(page, { [CV_STATE_KEY]: CORRUPT_PAYLOAD })
  await page.goto('/builder')
  await page.getByLabel('Full Name').fill('Recovered Owner')

  await notice(page).getByRole('button', { name: 'Start fresh' }).click()
  await notice(page).getByRole('button', { name: 'Cancel' }).click()
  expect(await readStorage(page, CV_STATE_KEY)).toBe(CORRUPT_PAYLOAD)

  await notice(page).getByRole('button', { name: 'Start fresh' }).click()
  await notice(page).getByRole('button', { name: 'Replace saved CV' }).click()
  await expect(notice(page)).toHaveCount(0)
  await expect.poll(() => savedProfileName(page)).toBe('Recovered Owner')
  expect(await readStorage(page, CV_RECOVERY_KEY)).toBe(CORRUPT_PAYLOAD)

  await page.getByLabel('Full Name').fill('Recovered Owner Edited')
  await expect.poll(() => savedProfileName(page)).toBe('Recovered Owner Edited')
  await page.reload()
  await expect(page.getByLabel('Full Name')).toHaveValue('Recovered Owner Edited')
  await expect(notice(page)).toHaveCount(0)
})

test('a valid saved CV loads, stays unchanged until edited, and persists edits', async ({ page }) => {
  const payload = await currentStatePayload(page, 'Valid Owner')
  await seedStorage(page, { [CV_STATE_KEY]: payload })
  await page.goto('/builder')
  await expect(page.getByLabel('Full Name')).toHaveValue('Valid Owner')
  await expect(notice(page)).toHaveCount(0)
  expect(await readStorage(page, CV_STATE_KEY)).toBe(payload)

  await page.getByLabel('Full Name').fill('Valid Owner 2')
  await expect.poll(() => savedProfileName(page)).toBe('Valid Owner 2')
})

test('a second tab pauses autosave instead of overwriting the first tab', async ({ page, context }) => {
  const payload = await currentStatePayload(page, 'Shared Owner')
  await seedStorage(page, { [CV_STATE_KEY]: payload })
  await page.goto('/builder')
  const other = await context.newPage()
  await other.goto('/builder')
  await expect(other.getByLabel('Full Name')).toHaveValue('Shared Owner')

  await page.getByLabel('Full Name').fill('Edited In First Tab')
  await expect.poll(() => savedProfileName(page)).toBe('Edited In First Tab')
  await expect(notice(other)).toContainText('changed in another tab')

  await other.getByLabel('Full Name').fill('Edited In Second Tab')
  await other.waitForTimeout(500)
  expect(await savedProfileName(page)).toBe('Edited In First Tab')

  await notice(other).getByRole('button', { name: 'Reload' }).click()
  await expect(other.getByLabel('Full Name')).toHaveValue('Edited In First Tab')
  await expect(notice(other)).toHaveCount(0)
})

test('keeping this tab version saves it and warns the other tab', async ({ page, context }) => {
  const payload = await currentStatePayload(page, 'Shared Owner')
  await seedStorage(page, { [CV_STATE_KEY]: payload })
  await page.goto('/builder')
  const other = await context.newPage()
  await other.goto('/builder')
  await expect(other.getByLabel('Full Name')).toHaveValue('Shared Owner')

  await page.getByLabel('Full Name').fill('First Tab')
  await expect(notice(other)).toBeVisible()
  await other.getByLabel('Full Name').fill('Second Tab Wins')
  await notice(other).getByRole('button', { name: "Keep this tab's version" }).click()
  await expect.poll(() => savedProfileName(page)).toBe('Second Tab Wins')
  await expect(notice(other)).toHaveCount(0)
  await expect(notice(page)).toContainText('changed in another tab')
})
