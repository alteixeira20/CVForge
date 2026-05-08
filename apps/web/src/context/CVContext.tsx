'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface CVContextValue {
  isPlaceholder?: boolean;
}

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: ReactNode }) {
  const [state] = useState({})

  return (
    <CVContext.Provider value={state}>
      {children}
    </CVContext.Provider>
  )
}

export function useCV() {
  const ctx = useContext(CVContext)
  if (!ctx) throw new Error('useCV must be used inside <CVProvider>')
  return ctx
}
