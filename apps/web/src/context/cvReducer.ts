import { type CVState, defaultCVState } from '@/types/cv'
import { type CVAction } from './cvActions'
import {
  addFeaturedSkill,
  moveFeaturedSkill,
  removeFeaturedSkill,
  updateFeaturedSkill,
  updateSoftSkills,
  updateTechnicalSkills,
} from './cvSkillsUpdates'
import {
  addSectionItem,
  moveSectionItem,
  removeSectionItem,
  updateSectionItem,
} from './cvStateUpdates'

export function cvReducer(state: CVState, action: CVAction): CVState {
  if (action.type === 'REPLACE_STATE') return action.state

  const newState = reduceCVState(state, action)
  if (newState === state) return state

  return {
    ...newState,
    updatedAt: new Date().toISOString(),
  }
}

function reduceCVState(state: CVState, action: Exclude<CVAction, { type: 'REPLACE_STATE' }>): CVState {
  switch (action.type) {
    case 'UPDATE_PROFILE_FIELD':
      return { ...state, resume: { ...state.resume, profile: { ...state.resume.profile, [action.field]: action.value } } }
    case 'UPDATE_SETTINGS_FIELD':
      return { ...state, settings: { ...state.settings, [action.field]: action.value } as CVState['settings'] }
    case 'ADD_SECTION_ITEM':
      return addSectionItem(state, action.sectionKey)
    case 'UPDATE_SECTION_ITEM':
      return updateSectionItem(state, action.sectionKey, action.id, action.field, action.value)
    case 'REMOVE_SECTION_ITEM':
      return removeSectionItem(state, action.sectionKey, action.id)
    case 'MOVE_SECTION_ITEM':
      return moveSectionItem(state, action.sectionKey, action.id, action.direction)
    case 'UPDATE_TECHNICAL_SKILLS':
      return updateTechnicalSkills(state, action.value)
    case 'UPDATE_SOFT_SKILLS':
      return updateSoftSkills(state, action.value)
    case 'ADD_FEATURED_SKILL':
      return addFeaturedSkill(state)
    case 'UPDATE_FEATURED_SKILL':
      return updateFeaturedSkill(state, action.index, action.patch)
    case 'REMOVE_FEATURED_SKILL':
      return removeFeaturedSkill(state, action.index)
    case 'MOVE_FEATURED_SKILL':
      return moveFeaturedSkill(state, action.index, action.direction)
    case 'RESET_STATE':
      return { ...defaultCVState }
  }
}
