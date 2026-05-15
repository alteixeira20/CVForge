'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { useCV } from '@/context/CVContext'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { ProjectsEditor } from '@/features/builder/projects/ProjectsEditor'
import { LanguagesEditor } from '@/features/builder/languages/LanguagesEditor'
import { SkillsEditor } from '@/features/builder/skills/SkillsEditor'
import { CustomSectionsEditor } from '@/features/builder/custom-sections/CustomSectionsEditor'

const BUILDER_SECTIONS = [
  { id: 'profile',    title: 'Personal Profile',  icon: 'users',    content: <ProfileEditor /> },
  { id: 'experience', title: 'Work Experience',   icon: 'activity', content: <WorkExperienceEditor /> },
  { id: 'education',  title: 'Education',          icon: 'fold',     content: <EducationEditor /> },
  { id: 'projects',   title: 'Projects',           icon: 'spark',    content: <ProjectsEditor /> },
  { id: 'skills',     title: 'Skills',             icon: 'shield',   content: <SkillsEditor /> },
  { id: 'custom',     title: 'Custom Sections',    icon: 'fold',     content: <CustomSectionsEditor /> },
  { id: 'languages',  title: 'Languages',          icon: 'users',    content: <LanguagesEditor /> },
  { id: 'settings',   title: 'Builder Settings',   icon: 'sun',      content: <SettingsEditor /> },
] satisfies Array<{ id: string; title: string; icon: IconName; content: ReactNode }>

export function BuilderSectionList() {
  const [expandedId, setExpandedId] = useState<string | null>('profile')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { addSectionItem } = useCV()

  const toggleSection = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleAddExperience = () => {
    addSectionItem('workExperience')
    setExpandedId('experience')
  }

  useEffect(() => {
    if (!expandedId || !sectionRefs.current[expandedId]) return
    const timer = setTimeout(() => {
      sectionRefs.current[expandedId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(timer)
  }, [expandedId])

  return (
    <div className="space-y-3 pb-16">
      {BUILDER_SECTIONS.map((section) => (
        <div
          key={section.id}
          ref={(el) => { sectionRefs.current[section.id] = el }}
          className="scroll-mt-16 lg:scroll-mt-32"
        >
          <WorkbenchSectionCard
            title={section.title}
            icon={section.icon}
            isExpanded={expandedId === section.id}
            onToggle={() => toggleSection(section.id)}
            headerActions={section.id === 'experience' ? (
              <button
                onClick={handleAddExperience}
                className="btn sm ghost px-8 py-4 h-auto text-[10px] uppercase tracking-wider font-bold hover:bg-bg-3 border border-border-faint hover:border-border-strong"
              >
                <Icon name="plus" size={10} />
                Add Experience
              </button>
            ) : undefined}
          >
            {section.content}
          </WorkbenchSectionCard>
        </div>
      ))}
    </div>
  )
}
