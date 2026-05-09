'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { defaultCVState } from '@/types/cv'
import { storage } from '@/lib/storage'
import { type CVContextValue } from './cvContextTypes'
import { cvReducer } from './cvReducer'
import { useCVActions } from './useCVActions'

export type { RepeatableSectionKey } from './cvActions'

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, defaultCVState)
  const actions = useCVActions(dispatch)

  useEffect(() => {
    const saved = storage.getCVState()
    if (saved) {
      dispatch({ type: 'REPLACE_STATE', state: saved })
    }
  }, [])

  useEffect(() => {
    if (state.updatedAt !== defaultCVState.updatedAt) {
      storage.setCVState(state)
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
    </CVContext.Provider>
  )
}

export function useCV() {
  const ctx = useContext(CVContext)
  if (!ctx) throw new Error('useCV must be used inside <CVProvider>')
  return ctx
}
