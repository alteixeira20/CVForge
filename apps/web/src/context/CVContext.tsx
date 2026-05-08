'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import {
  type CVState,
  type Profile,
  type Settings,
  defaultCVState,
} from '@/types/cv'
import { storage } from '@/lib/storage'

/**
 * ─── Actions ────────────────────────────────────────────────────────────────
 */

type CVAction =
  | { type: 'UPDATE_PROFILE_FIELD'; field: keyof Profile; value: string }
  | { type: 'UPDATE_SETTINGS_FIELD'; payload: { [K in keyof Settings]: { field: K; value: Settings[K] } }[keyof Settings] }
  | { type: 'RESET_STATE' }
  | { type: 'REPLACE_STATE'; state: CVState }

/**
 * ─── Reducer ────────────────────────────────────────────────────────────────
 */

function cvReducer(state: CVState, action: CVAction): CVState {
  let newState: CVState

  switch (action.type) {
    case 'UPDATE_PROFILE_FIELD':
      newState = {
        ...state,
        resume: {
          ...state.resume,
          profile: {
            ...state.resume.profile,
            [action.field]: action.value,
          },
        },
      }
      break

    case 'UPDATE_SETTINGS_FIELD':
      newState = {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.field]: action.payload.value,
        },
      }
      break

    case 'RESET_STATE':
      newState = {
        ...defaultCVState,
        updatedAt: new Date().toISOString(),
      }
      break

    case 'REPLACE_STATE':
      newState = action.state
      break

    default:
      return state
  }

  // Always update the timestamp for user-initiated changes (except REPLACE_STATE which might be a bulk load)
  if (action.type !== 'REPLACE_STATE') {
    newState.updatedAt = new Date().toISOString()
  }

  return newState
}

/**
 * ─── Context ────────────────────────────────────────────────────────────────
 */

interface CVContextValue {
  state: CVState
  updateProfileField: (field: keyof Profile, value: string) => void
  updateSettingsField: <K extends keyof Settings>(field: K, value: Settings[K]) => void
  resetState: () => void
  replaceState: (state: CVState) => void
}

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, defaultCVState)

  // Initialization: Load from storage
  useEffect(() => {
    const saved = storage.getCVState()
    if (saved) {
      dispatch({ type: 'REPLACE_STATE', state: saved })
    }
  }, [])

  // Persistence: Save on change
  useEffect(() => {
    // Only save if it's not the default empty state or if it has been modified
    if (state.updatedAt !== defaultCVState.updatedAt) {
      storage.setCVState(state)
    }
  }, [state])

  const updateProfileField = useCallback((field: keyof Profile, value: string) => {
    dispatch({ type: 'UPDATE_PROFILE_FIELD', field, value })
  }, [])

  const updateSettingsField = useCallback(<K extends keyof Settings>(field: K, value: Settings[K]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch({ type: 'UPDATE_SETTINGS_FIELD', payload: { field, value } as any })
  }, [])

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' })
  }, [])

  const replaceState = useCallback((state: CVState) => {
    dispatch({ type: 'REPLACE_STATE', state })
  }, [])

  return (
    <CVContext.Provider
      value={{
        state,
        updateProfileField,
        updateSettingsField,
        resetState,
        replaceState,
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
