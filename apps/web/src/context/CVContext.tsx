'use client'

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import { defaultCVState } from '@/types/cv'
import { storage } from '@/lib/storage'
import { type CVContextValue } from './cvContextTypes'
import { cvReducer } from './cvReducer'
import { useCVActions } from './useCVActions'

export type { RepeatableSectionKey } from './cvActions'

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, defaultCVState)
  const [storageError, setStorageError] = useState(false)
  const actions = useCVActions(dispatch)

  useEffect(() => {
    const saved = storage.getCVState()
    if (saved) {
      dispatch({ type: 'REPLACE_STATE', state: saved })
    }
  }, [])

  useEffect(() => {
    if (state.updatedAt !== defaultCVState.updatedAt) {
      setStorageError(!storage.setCVState(state))
    }
  }, [state])

  return (
    <CVContext.Provider
      value={{
        state,
        ...actions,
      }}
    >
      {children}
      {storageError && (
        <div
          className="fixed bottom-4 left-1/2 z-[100] max-w-md -translate-x-1/2 rounded-lg border border-red-400/30 bg-bg-2 px-4 py-3 text-center text-xs text-red-100 shadow-xl"
          role="alert"
        >
          Browser autosave is unavailable or full. Export a JSON backup now to avoid losing recent changes.
        </div>
      )}
    </CVContext.Provider>
  )
}

export function useCV() {
  const ctx = useContext(CVContext)
  if (!ctx) throw new Error('useCV must be used inside <CVProvider>')
  return ctx
}
