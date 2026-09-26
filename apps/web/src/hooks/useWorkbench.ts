'use client'

import { useState } from 'react'

export type WorkbenchPanelId = 'left' | 'right'

export function useWorkbench() {
  const [activePanel, setActivePanel] = useState<WorkbenchPanelId>('left')
  return { activePanel, setActivePanel }
}
