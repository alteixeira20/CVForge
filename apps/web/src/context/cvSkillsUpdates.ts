import { type CVState, type FeaturedSkill } from '@/types/cv'
import { type MoveDirection } from './cvActions'

export function updateTechnicalSkills(state: CVState, value: string[]): CVState {
  return setSkills(state, { technical: value })
}

export function updateSoftSkills(state: CVState, value: string[]): CVState {
  return setSkills(state, { soft: value })
}

export function addFeaturedSkill(state: CVState): CVState {
  const featuredWithRating = [...state.resume.skills.featuredWithRating, { skill: '', rating: 0 }]
  return setSkills(state, { featuredWithRating })
}

export function updateFeaturedSkill(state: CVState, index: number, patch: Partial<FeaturedSkill>): CVState {
  const featuredWithRating = state.resume.skills.featuredWithRating.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  )
  return setSkills(state, { featuredWithRating })
}

export function removeFeaturedSkill(state: CVState, index: number): CVState {
  const featuredWithRating = state.resume.skills.featuredWithRating.filter((_, itemIndex) => itemIndex !== index)
  return setSkills(state, { featuredWithRating })
}

export function moveFeaturedSkill(state: CVState, index: number, direction: MoveDirection): CVState {
  const items = [...state.resume.skills.featuredWithRating]
  const targetIndex = direction === 'up' ? index - 1 : index + 1

  if (targetIndex < 0 || targetIndex >= items.length) return state

  const [movedItem] = items.splice(index, 1)
  items.splice(targetIndex, 0, movedItem)
  return setSkills(state, { featuredWithRating: items })
}

function setSkills(state: CVState, patch: Partial<CVState['resume']['skills']>): CVState {
  return {
    ...state,
    resume: {
      ...state.resume,
      skills: {
        ...state.resume.skills,
        ...patch,
      },
    },
  }
}
