import { type CVState, parseCVState } from '@/types/cv'

export async function importCVState(file: File): Promise<CVState> {
  const parsed = parseCVState(JSON.parse(await file.text()))

  if (!parsed) {
    throw new Error('The selected file is not a valid CVForge backup.')
  }

  return parsed
}
