import { type CVState, type Profile, type Settings } from '@/types/cv'

export type RepeatableSectionKey = 'workExperience' | 'education' | 'projects' | 'languages'
export type MoveDirection = 'up' | 'down'

export type CVAction =
  | { type: 'UPDATE_PROFILE_FIELD'; field: keyof Profile; value: string }
  | { type: 'UPDATE_SETTINGS_FIELD'; field: keyof Settings; value: unknown }
  | { type: 'ADD_SECTION_ITEM'; sectionKey: RepeatableSectionKey }
  | { type: 'UPDATE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; field: string; value: unknown }
  | { type: 'REMOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string }
  | { type: 'MOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; direction: MoveDirection }
  | { type: 'RESET_STATE' }
  | { type: 'REPLACE_STATE'; state: CVState }
