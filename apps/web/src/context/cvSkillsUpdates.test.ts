import { describe, expect, it } from 'vitest'
import { defaultCVState, type CVState } from '@/types/cv'
import { updateFeaturedSkill } from './cvSkillsUpdates'

describe('featured skill updates', () => {
  it('keeps a saved rating when the skill name is edited', () => {
    const state = JSON.parse(JSON.stringify(defaultCVState)) as CVState
    state.resume.skills.featuredWithRating = [{ skill: 'React', rating: 4 }]
    const next = updateFeaturedSkill(state, 0, { skill: 'React Native' })
    expect(next.resume.skills.featuredWithRating).toEqual([{ skill: 'React Native', rating: 4 }])
  })
})
