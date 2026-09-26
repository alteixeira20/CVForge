import { type Page } from '@playwright/test'

export const CV_STATE_KEY = 'cvforge:state'
export const CV_RECOVERY_KEY = 'cvforge:state:recovery'

// Writes storage from a lightweight same-origin page so the Builder's own
// load path is exercised on the next navigation.
export async function seedStorage(page: Page, entries: Record<string, string>) {
  await page.goto('/robots.txt')
  await page.evaluate((values) => {
    localStorage.clear()
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value)
  }, entries)
}

export function readStorage(page: Page, key: string) {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key)
}

export function savedProfileName(page: Page) {
  return page.evaluate((storageKey) => {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw)?.resume?.profile?.name ?? null : null
  }, CV_STATE_KEY)
}
