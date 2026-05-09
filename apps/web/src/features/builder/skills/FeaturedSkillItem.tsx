'use client'

import { NumberInput } from '@/components/shared/form/NumberInput'
import { TextInput } from '@/components/shared/form/TextInput'
import { Icon } from '@/components/ui/Icon'
import { type FeaturedSkill } from '@/types/cv'

interface FeaturedSkillItemProps {
  id: string
  item: FeaturedSkill
  isFirst: boolean
  isLast: boolean
  onUpdate: (id: string, patch: Partial<FeaturedSkill>) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export function FeaturedSkillItem({ id, item, isFirst, isLast, onUpdate, onRemove, onMove }: FeaturedSkillItemProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_84px_auto] gap-8 items-center border-b border-border-faint py-10 last:border-none">
      <TextInput
        placeholder="e.g. React"
        value={item.skill}
        onChange={(event) => onUpdate(id, { skill: event.target.value })}
      />
      <NumberInput
        min={0}
        max={5}
        value={item.rating ?? 0}
        onChange={(value) => onUpdate(id, { rating: value })}
      />
      <FeaturedSkillActions id={id} isFirst={isFirst} isLast={isLast} onMove={onMove} onRemove={onRemove} />
    </div>
  )
}

function FeaturedSkillActions({
  id,
  isFirst,
  isLast,
  onMove,
  onRemove,
}: Pick<FeaturedSkillItemProps, 'id' | 'isFirst' | 'isLast' | 'onMove' | 'onRemove'>) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => onMove(id, 'up')} disabled={isFirst} className="iconbtn sm disabled:opacity-20" title="Move Up">
        <Icon name="chevron-down" size={12} className="rotate-180" />
      </button>
      <button onClick={() => onMove(id, 'down')} disabled={isLast} className="iconbtn sm disabled:opacity-20" title="Move Down">
        <Icon name="chevron-down" size={12} />
      </button>
      <button onClick={() => onRemove(id)} className="iconbtn sm hover:text-ember" title="Remove">
        <Icon name="x" size={12} />
      </button>
    </div>
  )
}
