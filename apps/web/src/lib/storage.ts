import { type CVState, parseCVState } from '@/types/cv'
import { isNewerSchemaVersion, migrateCVState } from '@/lib/cvMigrations'

const KEYS = {
  displayName: 'cv:displayName',
  lastSession: 'cv:lastSession',
  saved: 'cv:saved',
  cvState: 'cvforge:state',
} as const

export const CV_STATE_KEY = KEYS.cvState
export const CV_RECOVERY_KEY = 'cvforge:state:recovery'

export type CVLoadIssue = 'corrupt' | 'unsupported-version' | 'invalid'

export type CVLoadResult =
  | { status: 'empty' }
  | { status: 'loaded'; state: CVState; raw: string }
  | { status: 'unreadable'; raw: string; reason: CVLoadIssue }

function get(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function set(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function remove(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function readCVStateText(raw: string | null): CVLoadResult {
  if (!raw) return { status: 'empty' }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { status: 'unreadable', raw, reason: 'corrupt' }
  }

  if (isNewerSchemaVersion(parsed)) {
    return { status: 'unreadable', raw, reason: 'unsupported-version' }
  }

  const state = parseCVState(migrateCVState(parsed))
  if (!state) return { status: 'unreadable', raw, reason: 'invalid' }
  return { status: 'loaded', state, raw }
}

// Keeps an unreadable payload in a separate key so it survives even if the
// main key is later replaced. An existing, different recovery copy is never
// overwritten; the new payload gets its own timestamped key instead.
function preserveRecoveryCopy(raw: string): string | null {
  const existing = get(CV_RECOVERY_KEY)
  if (existing === raw) return CV_RECOVERY_KEY
  if (existing === null) {
    return set(CV_RECOVERY_KEY, raw) ? CV_RECOVERY_KEY : null
  }

  const datedKey = `${CV_RECOVERY_KEY}:${new Date().toISOString()}`
  return set(datedKey, raw) ? datedKey : null
}

export const storage = {
  getDisplayName(): string | null {
    return get(KEYS.displayName)
  },
  setDisplayName(name: string): void {
    set(KEYS.displayName, name)
  },

  getSaved(): boolean {
    return get(KEYS.saved) === 'true'
  },
  setSaved(saved: boolean): void {
    set(KEYS.saved, String(saved))
  },

  // CV State Persistence
  loadCVState(): CVLoadResult {
    return readCVStateText(get(KEYS.cvState))
  },
  getCVState(): CVState | null {
    const result = storage.loadCVState()
    return result.status === 'loaded' ? result.state : null
  },
  setCVState(state: CVState): boolean {
    return set(KEYS.cvState, JSON.stringify(state))
  },
  setCVStateText(text: string): boolean {
    return set(KEYS.cvState, text)
  },
  preserveUnreadableCVState(raw: string): string | null {
    return preserveRecoveryCopy(raw)
  },

  clearAll(): void {
    Object.values(KEYS).forEach(remove)
  },
}
