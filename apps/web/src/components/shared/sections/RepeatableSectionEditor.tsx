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
  onAdd?: () => void
  renderItem: (props: RepeatableItemRenderProps<T>) => ReactNode
  hideTitle?: boolean
}

export function RepeatableSectionEditor<T extends { id: string }>({
  title,
  icon,
  addLabel,
  emptyLabel,
  items,
  onAdd,
  renderItem,
  hideTitle = false,
}: RepeatableSectionEditorProps<T>) {
  const { isExpanded, toggleExpanded } = useExpandedItem(items)
  const showHeader = !hideTitle || !!onAdd

  return (
    <div className="space-y-2">
      {showHeader && (
        <SectionHeader
          title={hideTitle ? undefined : title}
          icon={hideTitle ? undefined : icon}
          onAdd={onAdd}
          addLabel={addLabel}
        />
      )}
      {items.length === 0 && <EmptySectionState>{emptyLabel}</EmptySectionState>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            {renderItem({
              item,
              isExpanded: isExpanded(item.id),
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
