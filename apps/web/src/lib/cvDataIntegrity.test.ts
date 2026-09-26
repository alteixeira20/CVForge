import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CURRENT_CV_SCHEMA_VERSION,
  defaultCVState,
  parseCVState,
  type CVState,
} from '@/types/cv'
import { importCVState } from '@/features/import-export/importCVState'
import { migrateCVState } from './cvMigrations'
import { storage } from './storage'

describe('CV data integrity', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('migrates a missing version and rejects an unsupported future version', () => {
    const legacy = fixture()
    delete (legacy as Partial<CVState>).schemaVersion
    expect((migrateCVState(legacy) as CVState).schemaVersion).toBe(CURRENT_CV_SCHEMA_VERSION)

    const future = { ...fixture(), schemaVersion: '99.0.0' }
    expect(migrateCVState(future)).toBe(future)
    expect(parseCVState(migrateCVState(future))).toBeNull()
  })

  it('preserves current-schema unknown fields instead of silently stripping them', () => {
    const input = {
      ...fixture(),
      extensionData: { source: 'future-compatible-extension' },
      resume: {
        ...fixture().resume,
        extensionData: { custom: true },
        profile: {
          ...fixture().resume.profile,
          pronunciation: 'zhwah-ow',
        },
      },
    }
    const parsed = parseCVState(input) as CVState & Record<string, unknown>
    expect(parsed.extensionData).toEqual(input.extensionData)
    expect((parsed.resume as unknown as Record<string, unknown>).extensionData)
      .toEqual(input.resume.extensionData)
    expect((parsed.resume.profile as unknown as Record<string, unknown>).pronunciation)
      .toBe('zhwah-ow')
  })

  it('round-trips long accented Unicode, order, visibility, and theme through JSON import', async () => {
    const input = fixture()
    input.resume.profile.name = 'Zoë Brontë-Smith'
    input.resume.profile.summary = 'Naïve café résumé experience across reliable, accessible, measurable platforms. '.repeat(80)
    input.settings.sectionOrder = ['skills', 'workExperience', 'education', 'projects', 'languages', 'customSections']
    input.settings.visibleSections.projects = false
    input.settings.themeColor = '#7a3218'

    const imported = await importCVState({
      text: async () => JSON.stringify(input),
    })
    expect(imported).toEqual(input)
  })

  it.each([
    '{broken',
    JSON.stringify({ ...fixture(), schemaVersion: '2.0.0' }),
    JSON.stringify({ schemaVersion: CURRENT_CV_SCHEMA_VERSION, resume: null }),
  ])('rejects malformed, future, or structurally invalid backups', async (contents) => {
    await expect(importCVState({ text: async () => contents })).rejects.toThrow()
  })

  it('persists and restores the complete structured state under the existing key', () => {
    const values = new Map<string, string>()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    })
    const state = fixture()
    expect(storage.setCVState(state)).toBe(true)
    expect(values.has('cvforge:state')).toBe(true)
    expect(storage.getCVState()).toEqual(state)
  })

  it('reports a blocked or full storage write instead of silently succeeding', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new DOMException('Quota exceeded', 'QuotaExceededError')
        },
        removeItem: () => undefined,
      },
    })
    expect(storage.setCVState(fixture())).toBe(false)
  })
})

function fixture(): CVState {
  return JSON.parse(JSON.stringify(defaultCVState)) as CVState
}
