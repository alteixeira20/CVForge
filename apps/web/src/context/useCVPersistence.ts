import { useCallback, useEffect, useRef, useState } from 'react'
import { type CVState, defaultCVState } from '@/types/cv'
import { CV_STATE_KEY, type CVLoadIssue, storage } from '@/lib/storage'

export type CVPersistenceStatus = 'loading' | 'ready' | 'blocked'

export interface UnreadableSavedCV {
  raw: string
  reason: CVLoadIssue
  recoveryKey: string | null
}

export interface CVPersistence {
  status: CVPersistenceStatus
  unreadable: UnreadableSavedCV | null
  storageError: boolean
  changedInAnotherTab: boolean
  replaceUnreadableSavedCV: () => void
  keepThisTabVersion: () => void
}

// Loads the saved CV once and persists later changes. Writes are suppressed
// until loading finishes, and stay suppressed while an unreadable saved CV
// exists, so it is never overwritten without an explicit user choice.
export function useCVPersistence(
  state: CVState,
  replaceState: (state: CVState) => void,
): CVPersistence {
  const [status, setStatus] = useState<CVPersistenceStatus>('loading')
  const [unreadable, setUnreadable] = useState<UnreadableSavedCV | null>(null)
  const [storageError, setStorageError] = useState(false)
  const [changedInAnotherTab, setChangedInAnotherTab] = useState(false)
  const loadedStateRef = useRef<CVState | null>(null)
  const lastSyncedTextRef = useRef<string | null>(null)
  useOtherTabChanges(lastSyncedTextRef, setChangedInAnotherTab)

  useEffect(() => {
    const result = storage.loadCVState()
    lastSyncedTextRef.current = result.status === 'empty' ? null : result.raw
    if (result.status === 'loaded') {
      loadedStateRef.current = result.state
      replaceState(result.state)
      setStatus('ready')
      return
    }
    if (result.status === 'unreadable') {
      const recoveryKey = storage.preserveUnreadableCVState(result.raw)
      setUnreadable({ raw: result.raw, reason: result.reason, recoveryKey })
      setStatus('blocked')
      return
    }
    setStatus('ready')
  }, [replaceState])

  const writeState = useCallback((next: CVState) => {
    const text = JSON.stringify(next)
    const saved = storage.setCVStateText(text)
    if (saved) lastSyncedTextRef.current = text
    setStorageError(!saved)
  }, [])

  useEffect(() => {
    if (status !== 'ready' || changedInAnotherTab) return
    if (state === defaultCVState || state === loadedStateRef.current) return
    writeState(state)
  }, [state, status, changedInAnotherTab, writeState])

  const replaceUnreadableSavedCV = useCallback(() => {
    writeState(state)
    setUnreadable(null)
    setStatus('ready')
  }, [state, writeState])

  const keepThisTabVersion = useCallback(() => {
    writeState(state)
    setChangedInAnotherTab(false)
  }, [state, writeState])

  return {
    status,
    unreadable,
    storageError,
    changedInAnotherTab,
    replaceUnreadableSavedCV,
    keepThisTabVersion,
  }
}

// Another tab saving the CV fires a storage event here. Autosave then pauses
// so this tab cannot silently overwrite the other tab's changes.
function useOtherTabChanges(
  lastSyncedTextRef: { current: string | null },
  onChange: (changed: boolean) => void,
) {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CV_STATE_KEY && event.key !== null) return
      if (event.newValue === lastSyncedTextRef.current) return
      onChange(true)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [lastSyncedTextRef, onChange])
}
