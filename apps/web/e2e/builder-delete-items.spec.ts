import { expect, test } from '@playwright/test'
import { CV_STATE_KEY, readStorage, seedStorage } from './support/cvStorage'
import { downloadBuilderPdf, extractPdf, joinWrapped } from './support/pdfText'
import { openBuilderWithCV, waitForFirstPreview } from './support/previewFixtures'
import { defaultCVState, type CVState } from '../src/types/cv'

function createPopulatedCVState(): CVState {
  const state: CVState = JSON.parse(JSON.stringify(defaultCVState))
  state.resume.profile = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+44 20 7946 0000',
    location: 'London, UK',
    website: 'https://example.com',
    github: 'github.com/example',
    linkedin: 'linkedin.com/in/example',
    summary: 'Pioneering mathematician and programmer.',
  }
  state.resume.workExperience = [
    {
      id: 'work-1',
      company: 'Babbage Engine Lab',
      role: 'Lead Analyst',
      location: 'London',
      startDate: '1842-01',
      endDate: '1843-12',
      isCurrent: false,
      bullets: ['Developed algorithmic descriptions for the Analytical Engine.'],
    },
  ]
  state.resume.education = [
    {
      id: 'edu-1',
      school: 'University of London',
      degree: 'Mathematics',
      location: 'London',
      startDate: '1832-09',
      endDate: '1836-06',
      details: ['Studies in advanced mathematics and analysis.'],
    },
  ]
  state.resume.projects = [
    {
      id: 'proj-1',
      name: 'Bernoulli Numbers Algorithm',
      link: 'example.com/bernoulli',
      startDate: '1842-01',
      endDate: '1843-01',
      bullets: ['First published computer algorithm in history.'],
    },
  ]
  state.resume.languages = [
    {
      id: 'lang-1',
      name: 'French',
      proficiency: 'Fluent',
    },
  ]
  state.resume.customSections = [
    {
      id: 'custom-1',
      title: 'Publications and Notes',
      bullets: ['Sketch of the Analytical Engine with Notes from the Translator.'],
    },
    {
      id: 'custom-2',
      title: 'Honorary Societies',
      bullets: ['Fellow of the Scientific Society.'],
    },
  ]
  state.settings.visibleSections = {
    ...state.settings.visibleSections,
    customSections: true,
  }
  return state
}

test.describe('Builder repeatable items deletion', () => {
  test('A. Custom section: add, arm, escape cancel, timeout cancel, confirm delete, and persist after reload', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.goto('/builder')

    // Find and click the Add Custom Section card
    const addCustomCard = page.getByRole('button', { name: /Add Custom Section/i })
    await expect(addCustomCard).toBeVisible()
    await addCustomCard.click()

    // The custom section card is now present and contains New Custom Section
    const customItem = page.locator('.rounded-lg').filter({ hasText: 'New Custom Section' })
    await expect(customItem).toBeVisible()

    // Locate the delete button inside the custom section item shell
    const deleteBtn = customItem.getByRole('button', { name: /Delete/i })
    await expect(deleteBtn).toBeVisible()
    await expect(deleteBtn).toHaveText('Delete')
    await expect(deleteBtn).toHaveAttribute('aria-pressed', 'false')

    // First click: arms confirmation
    await deleteBtn.click()
    const confirmBtn = customItem.getByRole('button', { name: /Confirm delete/i })
    await expect(confirmBtn).toBeVisible()
    await expect(confirmBtn).toHaveText('Confirm delete')
    await expect(confirmBtn).toHaveAttribute('aria-pressed', 'true')

    // Section remains present while armed
    await expect(page.getByText('New Custom Section')).toBeVisible()

    // Cancellation via Escape key
    await page.keyboard.press('Escape')
    await expect(deleteBtn).toBeVisible()
    await expect(deleteBtn).toHaveText('Delete')
    await expect(page.getByText('New Custom Section')).toBeVisible()

    // Arm again and test timeout cancellation (4s timeout)
    await deleteBtn.click()
    await expect(confirmBtn).toBeVisible()
    await expect(confirmBtn).toHaveText('Confirm delete')

    // Wait for timeout to expire (4000ms + buffer)
    await expect(deleteBtn).toHaveText('Delete', { timeout: 6000 })
    await expect(page.getByText('New Custom Section')).toBeVisible()

    // Arm again and confirm deletion
    await deleteBtn.click()
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Item should disappear immediately
    await expect(page.getByText('New Custom Section')).toHaveCount(0)

    // The Add Custom Section placeholder card returns
    await expect(addCustomCard).toBeVisible()

    // Reload page to verify deletion persisted
    await page.reload()
    await expect(page.getByText('New Custom Section')).toHaveCount(0)
    await expect(addCustomCard).toBeVisible()

    expect(pageErrors).toEqual([])
  })

  test('B. Existing populated custom section: delete correct item only', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const state = createPopulatedCVState()
    await seedStorage(page, { [CV_STATE_KEY]: JSON.stringify(state) })

    await page.goto('/builder')

    // Open custom sections card (title in settings may be "Custom Sections" or "Additional Information")
    const customCard = page.locator('.group').filter({ hasText: /Custom Sections|Additional Information/ })
    await customCard.getByRole('button', { name: /Expand section/i }).click()

    // Both custom sections are present
    await expect(page.getByText('Publications and Notes')).toBeVisible()
    await expect(page.getByText('Honorary Societies')).toBeVisible()

    // Delete the first custom section ("Publications and Notes")
    const pubItem = page.locator('.rounded-lg').filter({ hasText: 'Publications and Notes' })
    const pubDeleteBtn = pubItem.getByRole('button', { name: /Delete/i })
    await pubDeleteBtn.click()
    await expect(pubItem.getByRole('button', { name: /Confirm delete/i })).toBeVisible()
    await pubItem.getByRole('button', { name: /Confirm delete/i }).click()

    // First section disappears, second section remains
    await expect(page.getByText('Publications and Notes')).toHaveCount(0)
    await expect(page.getByText('Honorary Societies')).toBeVisible()

    // Verify storage reflects only the remaining item
    await expect.poll(async () => {
      const stored = await readStorage(page, CV_STATE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored) as CVState
      return parsed.resume.customSections.map((item) => item.title)
    }).toEqual(['Honorary Societies'])

    expect(pageErrors).toEqual([])
  })

  test('C. Other repeatable types: Work Experience, Education, Projects, Languages', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const state = createPopulatedCVState()
    await seedStorage(page, { [CV_STATE_KEY]: JSON.stringify(state) })

    await page.goto('/builder')

    // 1. Work Experience
    const expCard = page.locator('.group').filter({ hasText: 'Work Experience' })
    await expCard.getByRole('button', { name: /Expand section/i }).click()
    const expItem = expCard.locator('.rounded-lg').filter({ hasText: 'Babbage Engine Lab' })
    await expect(expItem).toBeVisible()
    const expDeleteBtn = expItem.getByRole('button', { name: /Delete/i })
    await expDeleteBtn.click()
    await expect(expItem.getByRole('button', { name: /Confirm delete/i })).toBeVisible()
    await expItem.getByRole('button', { name: /Confirm delete/i }).click()
    await expect(expCard.locator('.rounded-lg').filter({ hasText: 'Babbage Engine Lab' })).toHaveCount(0)

    // 2. Education
    const eduCard = page.locator('.group').filter({ hasText: 'Education' })
    await eduCard.getByRole('button', { name: /Expand section/i }).click()
    const eduItem = eduCard.locator('.rounded-lg').filter({ hasText: 'University of London' })
    await expect(eduItem).toBeVisible()
    const eduDeleteBtn = eduItem.getByRole('button', { name: /Delete/i })
    await eduDeleteBtn.click()
    await expect(eduItem.getByRole('button', { name: /Confirm delete/i })).toBeVisible()
    await eduItem.getByRole('button', { name: /Confirm delete/i }).click()
    await expect(eduCard.locator('.rounded-lg').filter({ hasText: 'University of London' })).toHaveCount(0)

    // 3. Projects
    const projCard = page.locator('.group').filter({ hasText: 'Projects' })
    await projCard.getByRole('button', { name: /Expand section/i }).click()
    const projItem = projCard.locator('.rounded-lg').filter({ hasText: 'Bernoulli Numbers Algorithm' })
    await expect(projItem).toBeVisible()
    const projDeleteBtn = projItem.getByRole('button', { name: /Delete/i })
    await projDeleteBtn.click()
    await expect(projItem.getByRole('button', { name: /Confirm delete/i })).toBeVisible()
    await projItem.getByRole('button', { name: /Confirm delete/i }).click()
    await expect(projCard.locator('.rounded-lg').filter({ hasText: 'Bernoulli Numbers Algorithm' })).toHaveCount(0)

    // 4. Languages
    const langCard = page.locator('.group').filter({ hasText: 'Languages' })
    await langCard.getByRole('button', { name: /Expand section/i }).click()
    const langItem = langCard.locator('.rounded-lg').filter({ hasText: 'French' })
    await expect(langItem).toBeVisible()
    const langDeleteBtn = langItem.getByRole('button', { name: /Delete/i })
    await langDeleteBtn.click()
    await expect(langItem.getByRole('button', { name: /Confirm delete/i })).toBeVisible()
    await langItem.getByRole('button', { name: /Confirm delete/i }).click()
    await expect(langCard.locator('.rounded-lg').filter({ hasText: 'French' })).toHaveCount(0)

    expect(pageErrors).toEqual([])
  })

  test('D. Keyboard-only deletion with Enter and Space keys', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const state = createPopulatedCVState()
    await seedStorage(page, { [CV_STATE_KEY]: JSON.stringify(state) })

    await page.goto('/builder')

    // Open Education section
    const eduCard = page.locator('.group').filter({ hasText: 'Education' })
    await eduCard.getByRole('button', { name: /Expand section/i }).click()
    const eduItem = eduCard.locator('.rounded-lg').filter({ hasText: 'University of London' })
    await expect(eduItem).toBeVisible()

    const eduDeleteBtn = eduItem.getByRole('button', { name: /Delete/i })
    await eduDeleteBtn.focus()

    // Test Enter key
    await page.keyboard.press('Enter')
    const confirmBtn = eduItem.getByRole('button', { name: /Confirm delete/i })
    await expect(confirmBtn).toBeVisible()
    await expect(confirmBtn).toHaveText('Confirm delete')

    // Enter again confirms deletion
    await page.keyboard.press('Enter')
    await expect(eduCard.locator('.rounded-lg').filter({ hasText: 'University of London' })).toHaveCount(0)

    // Now test Space key with Projects
    const projCard = page.locator('.group').filter({ hasText: 'Projects' })
    await projCard.getByRole('button', { name: /Expand section/i }).click()
    const projItem = projCard.locator('.rounded-lg').filter({ hasText: 'Bernoulli Numbers Algorithm' })
    await expect(projItem).toBeVisible()

    const projDeleteBtn = projItem.getByRole('button', { name: /Delete/i })
    await projDeleteBtn.focus()

    // Space key activates arm state
    await page.keyboard.press('Space')
    const projConfirmBtn = projItem.getByRole('button', { name: /Confirm delete/i })
    await expect(projConfirmBtn).toBeVisible()
    await expect(projConfirmBtn).toHaveText('Confirm delete')

    // Space key confirms deletion
    await page.keyboard.press('Space')
    await expect(projCard.locator('.rounded-lg').filter({ hasText: 'Bernoulli Numbers Algorithm' })).toHaveCount(0)

    expect(pageErrors).toEqual([])
  })

  test('E. Preview updates and removed item is absent from rendered PDF', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const state = createPopulatedCVState()
    state.resume.customSections = [
      {
        id: 'unique-custom-1',
        title: 'Unique Experimental Research 2026',
        bullets: ['Breakthrough observation on computational mechanics.'],
      },
    ]
    state.settings.visibleSections = {
      ...state.settings.visibleSections,
      customSections: true,
    }

    await openBuilderWithCV(page, JSON.stringify(state))
    await waitForFirstPreview(page)

    // Verify initial PDF includes the custom section bullet content
    const initialPdf = await extractPdf(await downloadBuilderPdf(page))
    expect(joinWrapped(initialPdf.lines)).toContain('Breakthrough observation on computational mechanics')

    // Open Custom Sections and delete the custom section
    const customCard = page.locator('.group').filter({ hasText: /Custom Sections|Additional Information/ })
    await customCard.getByRole('button', { name: /Expand section/i }).click()
    const customItem = customCard.locator('.rounded-lg').filter({ hasText: 'Unique Experimental Research 2026' })
    await expect(customItem).toBeVisible()

    const deleteBtn = customItem.getByRole('button', { name: /Delete/i })
    await deleteBtn.click()
    const confirmBtn = customItem.getByRole('button', { name: /Confirm delete/i })
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    await expect(page.getByText('Unique Experimental Research 2026')).toHaveCount(0)

    // Verify updated PDF no longer contains the deleted section content
    await expect.poll(async () => {
      const updatedPdf = await extractPdf(await downloadBuilderPdf(page))
      return joinWrapped(updatedPdf.lines).includes('Breakthrough observation on computational mechanics')
    }).toBe(false)

    expect(pageErrors).toEqual([])
  })

  test('F. Mobile viewport touch interaction deletes cleanly', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    })
    const page = await context.newPage()
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.goto('/builder')

    const addCustomCard = page.getByRole('button', { name: /Add Custom Section/i })
    await expect(addCustomCard).toBeVisible()
    await addCustomCard.tap()

    const customItem = page.locator('.rounded-lg').filter({ hasText: 'New Custom Section' })
    await expect(customItem).toBeVisible()

    const deleteBtn = customItem.getByRole('button', { name: /Delete/i })
    await expect(deleteBtn).toBeVisible()
    await expect(deleteBtn).toHaveText('Delete')

    // First tap arms confirmation
    await deleteBtn.tap()
    const confirmBtn = customItem.getByRole('button', { name: /Confirm delete/i })
    await expect(confirmBtn).toBeVisible()
    await expect(confirmBtn).toHaveText('Confirm delete')

    // Second tap confirms deletion
    await confirmBtn.tap()
    await expect(page.getByText('New Custom Section')).toHaveCount(0)
    await expect(addCustomCard).toBeVisible()

    await context.close()
    expect(pageErrors).toEqual([])
  })

  test('G. Safety guards: hover, focus, and cancelled pointer do not delete', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.goto('/builder')

    const addCustomCard = page.getByRole('button', { name: /Add Custom Section/i })
    await addCustomCard.click()

    const customItem = page.locator('.rounded-lg').filter({ hasText: 'New Custom Section' })
    const deleteBtn = customItem.getByRole('button', { name: /Delete/i })

    // Hover does not change text or arm button
    await deleteBtn.hover()
    await expect(deleteBtn).toHaveText('Delete')
    await expect(deleteBtn).toHaveAttribute('aria-pressed', 'false')

    // Focus does not change text or arm button
    await deleteBtn.focus()
    await expect(deleteBtn).toHaveText('Delete')
    await expect(deleteBtn).toHaveAttribute('aria-pressed', 'false')

    // Pointer down followed by dragging away before pointer up
    const box = await deleteBtn.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.up()
    }
    // Button must remain idle Delete, item must remain present
    await expect(deleteBtn).toHaveText('Delete')
    await expect(deleteBtn).toHaveAttribute('aria-pressed', 'false')
    await expect(page.getByText('New Custom Section')).toBeVisible()

    expect(pageErrors).toEqual([])
  })
})
