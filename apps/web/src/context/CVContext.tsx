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
 * ─── Types ──────────────────────────────────────────────────────────────────
 */

export type RepeatableSectionKey = 'workExperience' | 'education' | 'projects' | 'languages'

type CVAction =
  | { type: 'UPDATE_PROFILE_FIELD'; field: keyof Profile; value: string }
  | { type: 'UPDATE_SETTINGS_FIELD'; payload: { [K in keyof Settings]: { field: K; value: Settings[K] } }[keyof Settings] }
  | { type: 'ADD_SECTION_ITEM'; sectionKey: RepeatableSectionKey }
  | { type: 'UPDATE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; field: string; value: unknown }
  | { type: 'REMOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string }
  | { type: 'MOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; direction: 'up' | 'down' }
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

    case 'ADD_SECTION_ITEM': {
      const id = Math.random().toString(36).substring(2, 9)
      let newItem: unknown
      
      if (action.sectionKey === 'workExperience') {
        newItem = { id, company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, bullets: [] }
      } else if (action.sectionKey === 'education') {
        newItem = { id, school: '', degree: '', location: '', startDate: '', endDate: '', details: [] }
      } else if (action.sectionKey === 'projects') {
        newItem = { id, name: '', link: '', startDate: '', endDate: '', bullets: [] }
      } else if (action.sectionKey === 'languages') {
        newItem = { id, name: '', proficiency: '' }
      }

      newState = {
        ...state,
        resume: {
          ...state.resume,
          [action.sectionKey]: [...(state.resume[action.sectionKey] as unknown[]), newItem],
        },
      }
      break
    }

    case 'UPDATE_SECTION_ITEM': {
      const items = (state.resume[action.sectionKey] as { id: string }[]).map((item) =>
        item.id === action.id ? { ...item, [action.field]: action.value } : item
      )
      newState = {
        ...state,
        resume: {
          ...state.resume,
          [action.sectionKey]: items,
        },
      }
      break
    }

    case 'REMOVE_SECTION_ITEM': {
      const items = (state.resume[action.sectionKey] as { id: string }[]).filter((item) => item.id !== action.id)
      newState = {
        ...state,
        resume: {
          ...state.resume,
          [action.sectionKey]: items,
        },
      }
      break
    }

    case 'MOVE_SECTION_ITEM': {
      const items = [...(state.resume[action.sectionKey] as { id: string }[])]
      const index = items.findIndex((item) => item.id === action.id)
      if (index === -1) return state

      const targetIndex = action.direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= items.length) return state

      const [movedItem] = items.splice(index, 1)
      items.splice(targetIndex, 0, movedItem)

      newState = {
        ...state,
        resume: {
          ...state.resume,
          [action.sectionKey]: items,
        },
      }
      break
    }

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
  addSectionItem: (sectionKey: RepeatableSectionKey) => void
  updateSectionItem: (sectionKey: RepeatableSectionKey, id: string, field: string, value: unknown) => void
  removeSectionItem: (sectionKey: RepeatableSectionKey, id: string) => void
  moveSectionItem: (sectionKey: RepeatableSectionKey, id: string, direction: 'up' | 'down') => void
  resetState: () => void
  replaceState: (state: CVState) => void
}

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, defaultCVState)

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

  const updateProfileField = useCallback((field: keyof Profile, value: string) => {
    dispatch({ type: 'UPDATE_PROFILE_FIELD', field, value })
  }, [])

  const updateSettingsField = useCallback(<K extends keyof Settings>(field: K, value: Settings[K]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch({ type: 'UPDATE_SETTINGS_FIELD', payload: { field, value } as any })
  }, [])

  const addSectionItem = useCallback((sectionKey: RepeatableSectionKey) => {
    dispatch({ type: 'ADD_SECTION_ITEM', sectionKey })
  }, [])

  const updateSectionItem = useCallback((sectionKey: RepeatableSectionKey, id: string, field: string, value: unknown) => {
    dispatch({ type: 'UPDATE_SECTION_ITEM', sectionKey, id, field, value })
  }, [])

  const removeSectionItem = useCallback((sectionKey: RepeatableSectionKey, id: string) => {
    dispatch({ type: 'REMOVE_SECTION_ITEM', sectionKey, id })
  }, [])

  const moveSectionItem = useCallback((sectionKey: RepeatableSectionKey, id: string, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_SECTION_ITEM', sectionKey, id, direction })
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
        addSectionItem,
        updateSectionItem,
        removeSectionItem,
        moveSectionItem,
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
