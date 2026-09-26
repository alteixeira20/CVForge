import { type CVState } from '@/types/cv'
import { announce } from '@/lib/accessibility/announce'
import { downloadBlob } from '@/lib/downloadBlob'

export function exportCVState(state: CVState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  downloadBlob(blob, createBackupFileName(state))
  announce('JSON backup export completed.')
}

function createBackupFileName(state: CVState) {
  const name = state.resume.profile.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const prefix = name || 'cvforge'

  return `${prefix}-backup.json`
}
