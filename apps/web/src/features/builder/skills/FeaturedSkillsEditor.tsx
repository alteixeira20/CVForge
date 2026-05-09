'use client'

import { EmptySectionState } from '@/components/shared/sections/EmptySectionState'
import { SectionHeader } from '@/components/shared/sections/SectionHeader'
import { useCV } from '@/context/CVContext'
import { FeaturedSkillItem } from './FeaturedSkillItem'

export function FeaturedSkillsEditor() {
  const { state, addFeaturedSkill, updateFeaturedSkill, removeFeaturedSkill, moveFeaturedSkill } = useCV()
  const { featuredWithRating } = state.resume.skills

  return (
    <div className="space-y-4">
      <SectionHeader title="Featured Skills" icon="spark" onAdd={addFeaturedSkill} addLabel="Add Skill" />
      {featuredWithRating.length === 0 && <EmptySectionState>No featured skills added yet</EmptySectionState>}
      <div className="space-y-4">
        {featuredWithRating.map((item, index) => (
          <FeaturedSkillItem
            key={index}
            id={String(index)}
            item={item}
            isFirst={index === 0}
            isLast={index === featuredWithRating.length - 1}
            onUpdate={updateFeaturedSkill}
            onRemove={removeFeaturedSkill}
            onMove={moveFeaturedSkill}
          />
        ))}
      </div>
    </div>
  )
}
