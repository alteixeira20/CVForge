import { type CVState } from '@/types/cv'

export function exportCVState(state: CVState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = createBackupFileName(state)
  anchor.click()
  URL.revokeObjectURL(url)
}

function createBackupFileName(state: CVState) {
  const name = state.resume.profile.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const prefix = name || 'cvforge'

  return `${prefix}-backup.json`
}
