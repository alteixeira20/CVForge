import { type CVState } from '@/types/cv'
import { type MoveDirection, type RepeatableSectionKey } from './cvActions'
import { createSectionItem, type RepeatableSectionItem } from './sectionItemFactories'

export function addSectionItem(state: CVState, sectionKey: RepeatableSectionKey): CVState {
  return setSectionItems(state, sectionKey, [...state.resume[sectionKey], createSectionItem(sectionKey)])
}

export function updateSectionItem(
  state: CVState,
  sectionKey: RepeatableSectionKey,
  id: string,
  field: string,
  value: unknown,
): CVState {
  const items = state.resume[sectionKey].map((item) => item.id === id ? { ...item, [field]: value } : item)
  return setSectionItems(state, sectionKey, items)
}

export function removeSectionItem(state: CVState, sectionKey: RepeatableSectionKey, id: string): CVState {
  return setSectionItems(state, sectionKey, state.resume[sectionKey].filter((item) => item.id !== id))
}

export function moveSectionItem(
  state: CVState,
  sectionKey: RepeatableSectionKey,
  id: string,
  direction: MoveDirection,
): CVState {
  const items = [...state.resume[sectionKey]]
  const index = items.findIndex((item) => item.id === id)
  const targetIndex = direction === 'up' ? index - 1 : index + 1

  if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return state

  const [movedItem] = items.splice(index, 1)
  items.splice(targetIndex, 0, movedItem)
  return setSectionItems(state, sectionKey, items)
}

function setSectionItems(state: CVState, sectionKey: RepeatableSectionKey, items: RepeatableSectionItem[]): CVState {
  return {
    ...state,
    resume: {
      ...state.resume,
      [sectionKey]: items,
    } as CVState['resume'],
  }
}
