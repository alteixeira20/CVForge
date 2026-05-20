'use client'

import { useCV } from '@/context/CVContext'
import { BuilderAddFocusProvider } from '@/features/builder/context/BuilderAddFocusContext'
import { type SectionTitleKey } from '@/types/cv'
import { BUILDER_SECTIONS, SECTION_CONFIG, SECTION_ID_MAP, STATIC_TITLES } from './builderSectionConfig'
import { AddCustomSectionCard } from './AddCustomSectionCard'
import { BuilderSectionCard } from './BuilderSectionCard'
import { useBuilderSectionState } from './useBuilderSectionState'
import { useBuilderSectionActions } from './useBuilderSectionActions'

export function BuilderSectionList() {
  const { state, updateSettingsField } = useCV()
  const { expandedIds, focusVersions, toggleSection, openSection, bumpFocus } = useBuilderSectionState()
  const { handleAdd, toggleVisibility, handleMove } = useBuilderSectionActions({ openSection, bumpFocus })

  const hasCustomSections = state.resume.customSections.length > 0
  const sectionOrder = state.settings.sectionOrder

  const renderCard = (id: string) => {
    const section = BUILDER_SECTIONS.find(s => s.id === id)
    if (!section) return null

    const config = SECTION_CONFIG[section.id]
    const isVisible = config
      ? state.settings.visibleSections[config.titleKey as keyof typeof state.settings.visibleSections]
      : true
    const rawTitle = config
      ? state.settings.sectionTitles[config.titleKey]
      : (STATIC_TITLES[section.id] ?? section.id)
    const isReorderable = !!config && section.id !== 'profile' && section.id !== 'settings'
    const orderKey = config?.titleKey as SectionTitleKey | undefined
    const index = orderKey ? sectionOrder.indexOf(orderKey) : -1

    return (
      <BuilderSectionCard
        key={section.id}
        id={section.id}
        icon={section.icon}
        content={section.content}
        config={config}
        rawTitle={rawTitle}
        isExpanded={expandedIds.has(section.id)}
        isVisible={isVisible}
        isReorderable={isReorderable}
        index={index}
        total={sectionOrder.length}
        orderKey={orderKey}
        onToggle={() => toggleSection(section.id)}
        onAdd={config?.addKey ? () => handleAdd(config.addKey!, section.id) : undefined}
        onToggleVisibility={config ? () => toggleVisibility(config.titleKey) : undefined}
        onMove={orderKey ? (dir) => handleMove(orderKey, dir) : undefined}
        onRenameTitle={config ? (v) => updateSettingsField('sectionTitles', {
          ...state.settings.sectionTitles,
          [config.titleKey]: v,
        }) : undefined}
      />
    )
  }

  return (
    <BuilderAddFocusProvider versions={focusVersions}>
      <div className="space-y-3 pb-16">
        {renderCard('profile')}

        {sectionOrder.map((key) => {
          const id = SECTION_ID_MAP[key]
          if (id === 'custom' && !hasCustomSections) return null
          return renderCard(id)
        })}

        {!hasCustomSections && (
          <AddCustomSectionCard onAdd={() => handleAdd('customSections', 'custom')} />
        )}

        {renderCard('settings')}
      </div>
    </BuilderAddFocusProvider>
  )
}
