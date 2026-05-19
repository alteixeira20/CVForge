import { type CVState, type FeaturedSkill, type Profile, type Settings } from '@/types/cv'

export type RepeatableSectionKey = 'workExperience' | 'education' | 'projects' | 'languages' | 'customSections'
export type MoveDirection = 'up' | 'down'

export type CVAction =
  | { type: 'UPDATE_PROFILE_FIELD'; field: keyof Profile; value: string }
  | { type: 'UPDATE_SETTINGS_FIELD'; field: keyof Settings; value: unknown }
  | { type: 'ADD_SECTION_ITEM'; sectionKey: RepeatableSectionKey }
  | { type: 'UPDATE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; field: string; value: unknown }
  | { type: 'REMOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string }
  | { type: 'MOVE_SECTION_ITEM'; sectionKey: RepeatableSectionKey; id: string; direction: MoveDirection }
  | { type: 'UPDATE_TECHNICAL_SKILLS'; value: string[] }
  | { type: 'UPDATE_SOFT_SKILLS'; value: string[] }
  | { type: 'ADD_FEATURED_SKILL' }
  | { type: 'UPDATE_FEATURED_SKILL'; index: number; patch: Partial<FeaturedSkill> }
  | { type: 'REMOVE_FEATURED_SKILL'; index: number }
  | { type: 'MOVE_FEATURED_SKILL'; index: number; direction: MoveDirection }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_SETTINGS' }
  | { type: 'REPLACE_STATE'; state: CVState }
