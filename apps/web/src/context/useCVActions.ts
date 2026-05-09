import { useMemo, type Dispatch } from 'react'
import { type CVAction } from './cvActions'
import { type CVContextValue } from './cvContextTypes'

type CVActions = Omit<CVContextValue, 'state'>

export function useCVActions(dispatch: Dispatch<CVAction>) {
  return useMemo(() => createCVActions(dispatch), [dispatch])
}

function createCVActions(dispatch: Dispatch<CVAction>): CVActions {
  return {
    updateProfileField: (field, value) => dispatch({ type: 'UPDATE_PROFILE_FIELD', field, value }),
    updateSettingsField: (field, value) => dispatch({ type: 'UPDATE_SETTINGS_FIELD', field, value }),
    addSectionItem: (sectionKey) => dispatch({ type: 'ADD_SECTION_ITEM', sectionKey }),
    updateSectionItem: (sectionKey, id, field, value) => dispatch({ type: 'UPDATE_SECTION_ITEM', sectionKey, id, field, value }),
    removeSectionItem: (sectionKey, id) => dispatch({ type: 'REMOVE_SECTION_ITEM', sectionKey, id }),
    moveSectionItem: (sectionKey, id, direction) => dispatch({ type: 'MOVE_SECTION_ITEM', sectionKey, id, direction }),
    updateTechnicalSkills: (value) => dispatch({ type: 'UPDATE_TECHNICAL_SKILLS', value }),
    updateSoftSkills: (value) => dispatch({ type: 'UPDATE_SOFT_SKILLS', value }),
    addFeaturedSkill: () => dispatch({ type: 'ADD_FEATURED_SKILL' }),
    updateFeaturedSkill: (id, patch) => dispatch({ type: 'UPDATE_FEATURED_SKILL', id, patch }),
    removeFeaturedSkill: (id) => dispatch({ type: 'REMOVE_FEATURED_SKILL', id }),
    moveFeaturedSkill: (id, direction) => dispatch({ type: 'MOVE_FEATURED_SKILL', id, direction }),
    resetState: () => dispatch({ type: 'RESET_STATE' }),
    replaceState: (state) => dispatch({ type: 'REPLACE_STATE', state }),
  }
}
