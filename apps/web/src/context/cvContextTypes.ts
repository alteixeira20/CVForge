import { type CVState, type Profile, type Settings } from '@/types/cv'
import { type MoveDirection, type RepeatableSectionKey } from './cvActions'

export interface CVContextValue {
  state: CVState
  updateProfileField: (field: keyof Profile, value: string) => void
  updateSettingsField: <K extends keyof Settings>(field: K, value: Settings[K]) => void
  addSectionItem: (sectionKey: RepeatableSectionKey) => void
  updateSectionItem: (sectionKey: RepeatableSectionKey, id: string, field: string, value: unknown) => void
  removeSectionItem: (sectionKey: RepeatableSectionKey, id: string) => void
  moveSectionItem: (sectionKey: RepeatableSectionKey, id: string, direction: MoveDirection) => void
  resetState: () => void
  replaceState: (state: CVState) => void
}
