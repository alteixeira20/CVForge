import { useCV, type RepeatableSectionKey } from '@/context/CVContext'
import { type SectionTitleKey } from '@/types/cv'

type Params = {
  openSection: (id: string) => void
  bumpFocus: (key: RepeatableSectionKey) => void
}

export function useBuilderSectionActions({ openSection, bumpFocus }: Params) {
  const { addSectionItem, state, updateSettingsField } = useCV()

  const handleAdd = (sectionKey: RepeatableSectionKey, sectionId: string) => {
    addSectionItem(sectionKey)
    openSection(sectionId)
    bumpFocus(sectionKey)

    if (sectionKey === 'customSections') {
      if (!state.settings.visibleSections.customSections) {
        updateSettingsField('visibleSections', {
          ...state.settings.visibleSections,
          customSections: true,
        })
      }
      if (!state.settings.sectionOrder.includes('customSections')) {
        updateSettingsField('sectionOrder', [...state.settings.sectionOrder, 'customSections'])
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

  return { handleAdd, toggleVisibility, handleMove }
}
