import { type CVState, parseCVState } from '@/types/cv'
import { migrateCVState } from '@/lib/cvMigrations'

const KEYS = {
  displayName: 'cv:displayName',
  lastSession: 'cv:lastSession',
  saved: 'cv:saved',
  cvState: 'cvforge:state',
} as const

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
  getCVState(): CVState | null {
    const raw = get(KEYS.cvState)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return parseCVState(migrateCVState(parsed))
    } catch {
      return null
    }
  },
  setCVState(state: CVState): boolean {
    return set(KEYS.cvState, JSON.stringify(state))
  },

  clearAll(): void {
    Object.values(KEYS).forEach(remove)
  },
}
