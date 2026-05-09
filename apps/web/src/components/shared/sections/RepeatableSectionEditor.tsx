'use client'

import { Fragment, type ReactNode } from 'react'
import { type IconName } from '@/components/ui/Icon'
import { useExpandedItem } from '@/hooks/useExpandedItem'
import { EmptySectionState } from './EmptySectionState'
import { SectionHeader } from './SectionHeader'

interface RepeatableItemRenderProps<T> {
  item: T
  isExpanded: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

interface RepeatableSectionEditorProps<T extends { id: string }> {
  title: string
  icon: IconName
  addLabel: string
  emptyLabel: string
  items: T[]
  onAdd: () => void
  renderItem: (props: RepeatableItemRenderProps<T>) => ReactNode
}

export function RepeatableSectionEditor<T extends { id: string }>({
  title,
  icon,
  addLabel,
  emptyLabel,
  items,
  onAdd,
  renderItem,
}: RepeatableSectionEditorProps<T>) {
  const { expandedId, toggleExpanded } = useExpandedItem(items)

  return (
    <div className="space-y-4">
      <SectionHeader title={title} icon={icon} onAdd={onAdd} addLabel={addLabel} />
      {items.length === 0 && <EmptySectionState>{emptyLabel}</EmptySectionState>}
      <div className="space-y-4">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            {renderItem({
              item,
              isExpanded: expandedId === item.id,
              onToggle: () => toggleExpanded(item.id),
              isFirst: index === 0,
              isLast: index === items.length - 1,
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
