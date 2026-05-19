import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { EditableSectionTitle } from '@/components/shared/workbench/EditableSectionTitle'
import { type SectionTitleKey } from '@/types/cv'
import { SectionReorderControls } from './SectionReorderControls'
import { type SectionConfig } from './builderSectionConfig'

type Props = {
  id: string
  icon: IconName
  content: ReactNode
  config: SectionConfig | undefined
  rawTitle: string
  isExpanded: boolean
  isVisible: boolean
  isReorderable: boolean
  index: number
  total: number
  orderKey: SectionTitleKey | undefined
  onToggle: () => void
  onAdd?: () => void
  onToggleVisibility?: () => void
  onMove?: (direction: 'up' | 'down') => void
  onRenameTitle?: (value: string) => void
}

export function BuilderSectionCard({
  id,
  icon,
  content,
  config,
  rawTitle,
  isExpanded,
  isVisible,
  isReorderable,
  index,
  total,
  orderKey,
  onToggle,
  onAdd,
  onToggleVisibility,
  onMove,
  onRenameTitle,
}: Props) {
  const cardTitle = config && onRenameTitle ? (
    <EditableSectionTitle value={rawTitle} onSave={onRenameTitle} />
  ) : rawTitle

  const addAction = config?.addKey && onAdd ? (
    <button
      onClick={(e) => { e.stopPropagation(); onAdd() }}
      className="btn sm ghost px-8 py-4 h-auto text-[10px] uppercase tracking-wider font-bold hover:bg-bg-3 border border-border-faint hover:border-border-strong"
    >
      <Icon name="plus" size={10} />
      {config.addLabel}
    </button>
  ) : undefined

  const reorderActions = isReorderable && orderKey && onMove ? (
    <SectionReorderControls
      index={index}
      total={total}
      onMoveUp={(e) => { e.stopPropagation(); onMove('up') }}
      onMoveDown={(e) => { e.stopPropagation(); onMove('down') }}
    />
  ) : undefined

  return (
    <WorkbenchSectionCard
      key={id}
      title={cardTitle}
      icon={icon}
      isExpanded={isExpanded}
      onToggle={onToggle}
      headerActions={addAction}
      isVisible={isVisible}
      onToggleVisibility={config ? onToggleVisibility : undefined}
      reorderActions={reorderActions}
    >
      {content}
    </WorkbenchSectionCard>
  )
}
