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

const SECTION_ID_MAP: Record<string, string> = {
  workExperience: 'experience',
  education: 'education',
  projects: 'projects',
  skills: 'skills',
  languages: 'languages',
  customSections: 'custom',
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
    if (sectionKey === 'customSections') {
      const updates: Partial<typeof state.settings> = {}
      if (!state.settings.visibleSections.customSections) {
        updates.visibleSections = { ...state.settings.visibleSections, customSections: true }
      }
      if (!state.settings.sectionOrder.includes('customSections')) {
        updates.sectionOrder = [...state.settings.sectionOrder, 'customSections']
      }
      if (Object.keys(updates).length > 0) {
        Object.entries(updates).forEach(([field, value]) => {
          updateSettingsField(field as keyof typeof state.settings, value)
        })
      }
    }
  }

  const toggleVisibility = (titleKey: SectionTitleKey) => {
    updateSettingsField('visibleSections', {
      ...state.settings.visibleSections,
      [titleKey]: !state.settings.visibleSections[titleKey as keyof typeof state.settings.visibleSections],
    })
  }

  const handleMove = (key: string, direction: 'up' | 'down') => {
    const order = [...state.settings.sectionOrder]
    const index = order.indexOf(key)
    if (index === -1) return

    if (direction === 'up' && index > 0) {
      [order[index], order[index - 1]] = [order[index - 1], order[index]]
    } else if (direction === 'down' && index < order.length - 1) {
      [order[index], order[index + 1]] = [order[index + 1], order[index]]
    }

    updateSettingsField('sectionOrder', order)
  }

  const hasCustomSections = state.resume.customSections.length > 0

  const renderSectionCard = (id: string) => {
    const section = BUILDER_SECTIONS.find(s => s.id === id)
    if (!section) return null

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

    const isReorderable = !!config && section.id !== 'profile' && section.id !== 'settings'
    const sectionOrder = state.settings.sectionOrder
    const orderKey = config?.titleKey
    const index = orderKey ? sectionOrder.indexOf(orderKey) : -1
    const canMoveUp = index > 0
    const canMoveDown = index !== -1 && index < sectionOrder.length - 1

    const reorderActions = isReorderable ? (
      <div className="flex flex-col -ml-1 mr-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleMove(orderKey!, 'up') }}
          disabled={!canMoveUp}
          className={`p-1 rounded transition-colors ${canMoveUp ? 'text-ink-4 hover:text-ember' : 'text-border cursor-not-allowed'}`}
          title="Move section up"
        >
          <Icon name="arrow-up" size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleMove(orderKey!, 'down') }}
          disabled={!canMoveDown}
          className={`p-1 rounded transition-colors ${canMoveDown ? 'text-ink-4 hover:text-ember' : 'text-border cursor-not-allowed'}`}
          title="Move section down"
        >
          <Icon name="arrow-down" size={10} />
        </button>
      </div>
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
        reorderActions={reorderActions}
      >
        {section.content}
      </WorkbenchSectionCard>
    )
  }

  return (
    <BuilderAddFocusProvider versions={focusVersions}>
      <div className="space-y-3 pb-16">
        {renderSectionCard('profile')}
        
        {state.settings.sectionOrder.map((key) => {
          const id = SECTION_ID_MAP[key]
          if (id === 'custom' && !hasCustomSections) return null
          return renderSectionCard(id)
        })}

        {!hasCustomSections && (
          <button
            onClick={() => handleAdd('customSections', 'custom')}
            className="w-full p-12 lg:p-16 bg-bg-inset border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-bg-2 border border-border flex items-center justify-center mb-6 group-hover:border-ember/50 transition-colors">
              <Icon name="plus" size={14} className="text-ink-4 group-hover:text-ember transition-colors" />
            </div>
            <h3 className="text-[13px] font-medium text-ink">Add Custom Section</h3>
            <p className="text-[11px] text-ink-3 mt-3">
              Certifications, awards, publications, volunteering, or other CV sections.
            </p>
          </button>
        )}

        {renderSectionCard('settings')}
      </div>
    </BuilderAddFocusProvider>
  )
}
