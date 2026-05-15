'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { type RepeatableSectionKey } from '@/context/CVContext'

type FocusVersionMap = Partial<Record<RepeatableSectionKey, number>>

const BuilderAddFocusContext = createContext<FocusVersionMap>({})

export function BuilderAddFocusProvider({
  versions,
  children,
}: {
  versions: FocusVersionMap
  children: ReactNode
}) {
  return (
    <BuilderAddFocusContext.Provider value={versions}>
      {children}
    </BuilderAddFocusContext.Provider>
  )
}

export function useAddFocusVersion(key: RepeatableSectionKey): number {
  return useContext(BuilderAddFocusContext)[key] ?? 0
}
