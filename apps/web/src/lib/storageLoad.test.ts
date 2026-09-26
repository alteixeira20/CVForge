import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CURRENT_CV_SCHEMA_VERSION, defaultCVState, type CVState } from '@/types/cv'
import { CV_RECOVERY_KEY, CV_STATE_KEY, readCVStateText, storage } from './storage'

describe('saved CV load result', () => {
  let values: Map<string, string>

  beforeEach(() => {
    vi.unstubAllGlobals()
    values = new Map()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    })
  })

  it('reports nothing stored as empty', () => {
    expect(storage.loadCVState()).toEqual({ status: 'empty' })
    expect(readCVStateText('')).toEqual({ status: 'empty' })
  })

  it('loads a current-schema CV', () => {
    const raw = JSON.stringify(fixture())
    values.set(CV_STATE_KEY, raw)
    const result = storage.loadCVState()
    expect(result.status).toBe('loaded')
    expect(result.status === 'loaded' && result.state).toEqual(fixture())
  })

  it('migrates a CV saved without a schema version', () => {
    const legacy: Partial<CVState> = fixture()
    delete legacy.schemaVersion
    const result = readCVStateText(JSON.stringify(legacy))
    expect(result.status === 'loaded' && result.state.schemaVersion).toBe(CURRENT_CV_SCHEMA_VERSION)
  })

  it.each([
    ['corrupt', '{"resume": {"profile"'],
    ['unsupported-version', JSON.stringify({ ...fixture(), schemaVersion: '99.0.0' })],
    ['unsupported-version', JSON.stringify({ ...fixture(), schemaVersion: '1.0.10' })],
    ['invalid', JSON.stringify({ schemaVersion: CURRENT_CV_SCHEMA_VERSION, resume: null })],
    ['invalid', '"just a string"'],
  ])('reports %s saved data as unreadable and keeps the raw text', (reason, raw) => {
    values.set(CV_STATE_KEY, raw)
    expect(storage.loadCVState()).toEqual({ status: 'unreadable', raw, reason })
    expect(storage.getCVState()).toBeNull()
    expect(values.get(CV_STATE_KEY)).toBe(raw)
  })

  it('stores a recovery copy once and never overwrites a different one', () => {
    expect(storage.preserveUnreadableCVState('first')).toBe(CV_RECOVERY_KEY)
    expect(storage.preserveUnreadableCVState('first')).toBe(CV_RECOVERY_KEY)
    expect(values.get(CV_RECOVERY_KEY)).toBe('first')

    const secondKey = storage.preserveUnreadableCVState('second')
    expect(secondKey).toMatch(/^cvforge:state:recovery:\d{4}-/)
    expect(values.get(CV_RECOVERY_KEY)).toBe('first')
    expect(values.get(secondKey!)).toBe('second')
  })

  it('reports a failed recovery copy instead of claiming success', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new DOMException('Quota exceeded', 'QuotaExceededError')
        },
        removeItem: () => undefined,
      },
    })
    expect(storage.preserveUnreadableCVState('raw')).toBeNull()
  })
})

function fixture(): CVState {
  return JSON.parse(JSON.stringify(defaultCVState)) as CVState
}
