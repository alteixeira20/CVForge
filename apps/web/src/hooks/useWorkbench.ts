'use client'

import { useState, useEffect } from 'react'

export type WorkbenchPanelId = 'left' | 'right'

export function useWorkbench() {
  const [activePanel, setActivePanel] = useState<WorkbenchPanelId>('left')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return {
    activePanel,
    setActivePanel,
    isDesktop,
    showLeft: isDesktop || activePanel === 'left',
    showRight: isDesktop || activePanel === 'right',
  }
}
