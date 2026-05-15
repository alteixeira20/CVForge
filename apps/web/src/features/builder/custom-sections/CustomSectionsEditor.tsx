'use client'

import { useCV } from '@/context/CVContext'
import { useAddFocusVersion } from '@/context/BuilderAddFocusContext'
import { RepeatableSectionEditor } from '@/components/shared/sections/RepeatableSectionEditor'
import { CustomSectionItem } from './CustomSectionItem'

export function CustomSectionsEditor() {
  const { state } = useCV()
  const { customSections } = state.resume
  const focusLatestVersion = useAddFocusVersion('customSections')

  return (
    <RepeatableSectionEditor
      title="Custom Sections"
      icon="anvil"
      addLabel="Add Section"
      emptyLabel="No custom sections added yet"
      items={customSections}
      hideTitle
      focusLatestVersion={focusLatestVersion}
      renderItem={({ item, isExpanded, onToggle, isFirst, isLast }) => (
        <CustomSectionItem
          item={item}
          isExpanded={isExpanded}
          onToggle={onToggle}
          isFirst={isFirst}
          isLast={isLast}
        />
      )}
    />
  )
}
