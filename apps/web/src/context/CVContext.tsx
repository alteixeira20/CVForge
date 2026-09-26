'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { defaultCVState } from '@/types/cv'
import { type CVContextValue } from './cvContextTypes'
import { cvReducer } from './cvReducer'
import { useCVActions } from './useCVActions'
import { useCVPersistence } from './useCVPersistence'

export type { RepeatableSectionKey } from './cvActions'

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, defaultCVState)
  const actions = useCVActions(dispatch)
  const persistence = useCVPersistence(state, actions.replaceState)

  return (
    <CVContext.Provider
      value={{
        state,
        persistence,
        ...actions,
      }}
    >
      {children}
      {persistence.storageError && (
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
