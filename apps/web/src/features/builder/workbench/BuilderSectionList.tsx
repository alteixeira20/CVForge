'use client'

import { useState, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useCV } from '@/context/CVContext'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { ProjectsEditor } from '@/features/builder/projects/ProjectsEditor'
import { LanguagesEditor } from '@/features/builder/languages/LanguagesEditor'
import { SkillsEditor } from '@/features/builder/skills/SkillsEditor'
import { CustomSectionsEditor } from '@/features/builder/custom-sections/CustomSectionsEditor'

export function BuilderSectionList() {
  const { state } = useCV()
  const { resume } = state
  const [expandedId, setExpandedId] = useState<string | null>('profile')

  const toggleSection = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatus = (id: string) => {
    switch (id) {
      case 'profile':
        return resume.profile.name ? 'Filled' : 'Empty'
      case 'experience':
        return resume.workExperience.length > 0 ? `${resume.workExperience.length} items` : 'Empty'
      case 'education':
        return resume.education.length > 0 ? `${resume.education.length} items` : 'Empty'
      case 'projects':
        return resume.projects.length > 0 ? `${resume.projects.length} items` : 'Empty'
      case 'skills':
        const skillCount = resume.skills.featured.length + resume.skills.featuredWithRating.length + resume.skills.technical.length + resume.skills.soft.length
        return skillCount > 0 ? `${skillCount} skills` : 'Empty'
      case 'languages':
        return resume.languages.length > 0 ? `${resume.languages.length} items` : 'Empty'
      case 'custom':
        return resume.customSections.length > 0 ? `${resume.customSections.length} sections` : 'Empty'
      default:
        return ''
    }
  }

  const BUILDER_SECTIONS = [
    { id: 'profile', title: 'Personal Profile', icon: 'users', content: <ProfileEditor /> },
    { id: 'experience', title: 'Experience', icon: 'activity', content: <WorkExperienceEditor /> },
    { id: 'education', title: 'Education', icon: 'fold', content: <EducationEditor /> },
    { id: 'projects', title: 'Projects', icon: 'spark', content: <ProjectsEditor /> },
    { id: 'skills', title: 'Skills', icon: 'shield', content: <SkillsEditor /> },
    { id: 'custom', title: 'Custom Sections', icon: 'fold', content: <CustomSectionsEditor /> },
    { id: 'languages', title: 'Languages', icon: 'users', content: <LanguagesEditor /> },
    { id: 'settings', title: 'Builder Settings', icon: 'sun', content: <SettingsEditor /> },
  ] satisfies Array<{ id: string; title: string; icon: IconName; content: ReactNode }>

  return (
    <div className="space-y-4">
      {BUILDER_SECTIONS.map((section) => (
        <BuilderSectionAccordion
          key={section.id}
          section={section}
          status={getStatus(section.id)}
          isExpanded={expandedId === section.id}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}

function BuilderSectionAccordion({
  section,
  status,
  isExpanded,
  onToggle,
}: {
  section: { title: string; icon: IconName; content: ReactNode }
  status: string
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isExpanded
          ? 'border-border-strong bg-bg-2 shadow-sm'
          : 'border-border bg-bg hover:border-border-strong hover:bg-bg-2/50'
      }`}
    >
      {/* Accent Line */}
      <div
        className={`absolute left-0 top-12 bottom-12 w-3 rounded-r-sm transition-opacity ${
          isExpanded ? 'bg-ember opacity-100' : 'bg-ink-4 opacity-0 group-hover:opacity-40'
        }`}
      />

      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-12 p-16 pl-20 text-left outline-none"
      >
        <div className="flex items-center gap-12 overflow-hidden">
          <div
            className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              isExpanded
                ? 'border-ember/30 bg-ember/10 text-ember'
                : 'border-border bg-bg-3 text-ink-3 group-hover:text-ink-2'
            }`}
          >
            <Icon name={section.icon} size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`truncate text-sm font-medium tracking-tight transition-colors ${
                isExpanded ? 'text-ink' : 'text-ink-2 group-hover:text-ink'
              }`}
            >
              {section.title}
            </span>
            {status && (
              <span className="text-[9px] font-mono text-ink-4 uppercase tracking-[0.08em] truncate">
                {status}
              </span>
            )}
          </div>
        </div>
        <Icon
          name="chevron-down"
          size={12}
          className={`shrink-0 text-ink-4 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-ink-3' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-border-faint p-6 lg:p-8 animate-in fade-in slide-in-from-top-1 duration-200">
          {section.content}
        </div>
      )}
    </div>
  )
}
