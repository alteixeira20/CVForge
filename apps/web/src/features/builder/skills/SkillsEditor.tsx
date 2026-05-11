'use client'

import { useCV } from '@/context/CVContext'
import { FeaturedSkillsEditor } from './FeaturedSkillsEditor'
import { SkillListEditor } from './SkillListEditor'

export function SkillsEditor() {
  const { state, updateTechnicalSkills, updateSoftSkills } = useCV()
  const { technical, soft } = state.resume.skills

  return (
    <div className="space-y-10">
      <FeaturedSkillsEditor />
      <SkillListEditor
        label="Technical Skills (One per line)"
        placeholder={`TypeScript\nReact\nNode.js`}
        value={technical}
        onChange={updateTechnicalSkills}
      />
      <SkillListEditor
        label="Soft Skills (One per line)"
        placeholder={`Leadership\nClear communication\nMentoring`}
        value={soft}
        onChange={updateSoftSkills}
      />
    </div>
  )
}
