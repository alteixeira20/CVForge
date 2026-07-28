import { type CVState, parseCVState } from '@/types/cv'
import { migrateCVState } from '@/lib/cvMigrations'

export async function importCVState(file: { text: () => Promise<string> }): Promise<CVState> {
  const parsed = parseCVState(migrateCVState(JSON.parse(await file.text())))

  if (!parsed) {
    throw new Error('The selected file is not a valid CVForge backup.')
  }

  return parsed
}
