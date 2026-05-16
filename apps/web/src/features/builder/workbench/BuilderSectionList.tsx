'use client'

import { useState, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { EditableSectionTitle } from '@/components/shared/workbench/EditableSectionTitle'
import { useCV, type RepeatableSectionKey } from '@/context/CVContext'
import { BuilderAddFocusProvider } from '@/context/BuilderAddFocusContext'
import { type SectionTitleKey } from '@/types/cv'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { ProjectsEditor } from '@/features/builder/projects/ProjectsEditor'
import { LanguagesEditor } from '@/features/builder/languages/LanguagesEditor'
import { SkillsEditor } from '@/features/builder/skills/SkillsEditor'
import { CustomSectionsEditor } from '@/features/builder/custom-sections/CustomSectionsEditor'

const BUILDER_SECTIONS = [
  { id: 'profile',    icon: 'users',     content: <ProfileEditor /> },
  { id: 'experience', icon: 'activity',  content: <WorkExperienceEditor /> },
  { id: 'education',  icon: 'file-text', content: <EducationEditor /> },
  { id: 'projects',   icon: 'spark',     content: <ProjectsEditor /> },
  { id: 'skills',     icon: 'shield',    content: <SkillsEditor /> },
  { id: 'custom',     icon: 'anvil',     content: <CustomSectionsEditor /> },
  { id: 'languages',  icon: 'flame',     content: <LanguagesEditor /> },
  { id: 'settings',   icon: 'settings',  content: <SettingsEditor /> },
] satisfies Array<{ id: string; icon: IconName; content: ReactNode }>

// Maps section card IDs to their settings.sectionTitles key and display fallback
type SectionConfig = { titleKey: SectionTitleKey; addKey?: RepeatableSectionKey; addLabel?: string }
const SECTION_CONFIG: Record<string, SectionConfig | undefined> = {
  experience: { titleKey: 'workExperience', addKey: 'workExperience', addLabel: 'Add Experience' },
  education:  { titleKey: 'education',      addKey: 'education',      addLabel: 'Add Education'  },
  projects:   { titleKey: 'projects',       addKey: 'projects',       addLabel: 'Add Project'    },
  skills:     { titleKey: 'skills' },
  languages:  { titleKey: 'languages',      addKey: 'languages',      addLabel: 'Add Language'   },
  custom:     { titleKey: 'customSections', addKey: 'customSections', addLabel: 'Add Section'    },
}

const STATIC_TITLES: Record<string, string> = {
  profile:  'Personal Profile',
  settings: 'Builder Settings',
}

export function BuilderSectionList() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(['profile']))
  const [focusVersions, setFocusVersions] = useState<Partial<Record<RepeatableSectionKey, number>>>({})
  const { addSectionItem, state, updateSettingsField } = useCV()

  const isSectionExpanded = (id: string) => expandedIds.has(id)

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const openSection = (id: string) => {
    setExpandedIds((prev) => new Set([...prev, id]))
  }

  const bumpFocus = (key: RepeatableSectionKey) => {
    setFocusVersions((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  const handleAdd = (sectionKey: RepeatableSectionKey, sectionId: string) => {
    addSectionItem(sectionKey)
    openSection(sectionId)
    bumpFocus(sectionKey)

    // Ensure custom sections are visible when adding one
    if (sectionKey === 'customSections' && !state.settings.visibleSections.customSections) {
      updateSettingsField('visibleSections', {
        ...state.settings.visibleSections,
        customSections: true,
      })
    }
  }

  const toggleVisibility = (titleKey: SectionTitleKey) => {
    updateSettingsField('visibleSections', {
      ...state.settings.visibleSections,
      [titleKey]: !state.settings.visibleSections[titleKey as keyof typeof state.settings.visibleSections],
    })
  }

  return (
    <BuilderAddFocusProvider versions={focusVersions}>
      <div className="space-y-3 pb-16">
      {BUILDER_SECTIONS.map((section) => {
        const config = SECTION_CONFIG[section.id]
        const isVisible = config ? state.settings.visibleSections[config.titleKey as keyof typeof state.settings.visibleSections] : true

        const rawTitle = config
          ? state.settings.sectionTitles[config.titleKey]
          : (STATIC_TITLES[section.id] ?? section.id)

        const cardTitle = config ? (
          <EditableSectionTitle
            value={rawTitle}
            onSave={(v) => updateSettingsField('sectionTitles', {
              ...state.settings.sectionTitles,
              [config.titleKey]: v,
            })}
          />
        ) : rawTitle

        const addAction = config?.addKey ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAdd(config.addKey!, section.id)
            }}
            className="btn sm ghost px-8 py-4 h-auto text-[10px] uppercase tracking-wider font-bold hover:bg-bg-3 border border-border-faint hover:border-border-strong"
          >
            <Icon name="plus" size={10} />
            {config.addLabel}
          </button>
        ) : undefined

        return (
          <WorkbenchSectionCard
            key={section.id}
            title={cardTitle}
            icon={section.icon}
            isExpanded={isSectionExpanded(section.id)}
            onToggle={() => toggleSection(section.id)}
            headerActions={addAction}
            isVisible={isVisible}
            onToggleVisibility={config ? () => toggleVisibility(config.titleKey) : undefined}
          >
            {section.id === 'custom' && isSectionExpanded(section.id) && (
              <div className="mb-6 p-4 rounded-lg bg-bg-3 border border-border-faint">
                <div className="flex gap-10 items-start">
                  <Icon name="anvil" size={14} className="text-ember mt-1 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-ink">Custom Sections</p>
                    <p className="text-[11px] text-ink-3 leading-relaxed">
                      Use this for certifications, awards, publications, volunteering, or other CV sections.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {section.content}
          </WorkbenchSectionCard>
        )
      })}
      </div>
    </BuilderAddFocusProvider>
  )
}
