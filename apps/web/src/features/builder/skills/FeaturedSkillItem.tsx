'use client'

import { NumberInput } from '@/components/shared/form/NumberInput'
import { TextInput } from '@/components/shared/form/TextInput'
import { Icon } from '@/components/ui/Icon'
import { type FeaturedSkill } from '@/types/cv'

interface FeaturedSkillItemProps {
  index: number
  item: FeaturedSkill
  isFirst: boolean
  isLast: boolean
  onUpdate: (index: number, patch: Partial<FeaturedSkill>) => void
  onRemove: (index: number) => void
  onMove: (index: number, direction: 'up' | 'down') => void
}

export function FeaturedSkillItem({ index, item, isFirst, isLast, onUpdate, onRemove, onMove }: FeaturedSkillItemProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_60px_auto] gap-2 items-center border-b border-border-faint py-2 last:border-none">
      <TextInput
        placeholder="e.g. React"
        value={item.skill}
        onChange={(event) => onUpdate(index, { skill: event.target.value })}
      />
      <NumberInput
        min={0}
        max={5}
        value={item.rating ?? 0}
        onChange={(value) => onUpdate(index, { rating: value })}
      />
      <FeaturedSkillActions index={index} isFirst={isFirst} isLast={isLast} onMove={onMove} onRemove={onRemove} />
    </div>
  )
}

function FeaturedSkillActions({
  index,
  isFirst,
  isLast,
  onMove,
  onRemove,
}: Pick<FeaturedSkillItemProps, 'index' | 'isFirst' | 'isLast' | 'onMove' | 'onRemove'>) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => onMove(index, 'up')} disabled={isFirst} className="iconbtn sm disabled:opacity-20" title="Move Up" aria-label="Move skill up">
        <Icon name="chevron-down" size={12} className="rotate-180" />
      </button>
      <button onClick={() => onMove(index, 'down')} disabled={isLast} className="iconbtn sm disabled:opacity-20" title="Move Down" aria-label="Move skill down">
        <Icon name="chevron-down" size={12} />
      </button>
      <button onClick={() => onRemove(index)} className="iconbtn sm hover:text-ember" title="Remove" aria-label="Remove skill">
        <Icon name="x" size={12} />
      </button>
    </div>
  )
}
