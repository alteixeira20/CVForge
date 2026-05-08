'use client'

import { Icon, type IconName } from '@/components/ui/Icon'

interface SectionHeaderProps {
  title: string
  icon?: IconName
  onAdd?: () => void
  addLabel?: string
}

export function SectionHeader({ title, icon, onAdd, addLabel = 'Add' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-12 mb-16">
      <div className="flex items-center gap-8">
        {icon && <Icon name={icon} size={14} className="text-ember" />}
        <h3 className="text-xs uppercase tracking-widest text-ink-4 font-semibold">{title}</h3>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="btn sm ghost px-8 py-4 h-auto text-[10px] uppercase tracking-wider font-bold hover:bg-bg-3 border border-border-faint hover:border-border-strong"
        >
          <Icon name="plus" size={10} />
          {addLabel}
        </button>
      )}
    </div>
  )
}
