import { Icon } from '@/components/ui/Icon'

type Props = {
  index: number
  total: number
  onMoveUp: (e: React.MouseEvent) => void
  onMoveDown: (e: React.MouseEvent) => void
}

export function SectionReorderControls({ index, total, onMoveUp, onMoveDown }: Props) {
  const canMoveUp = index > 0
  const canMoveDown = index < total - 1

  return (
    <div className="flex flex-col -ml-1 mr-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className={`inline-flex h-9 w-9 items-center justify-center rounded transition-colors ${canMoveUp ? 'text-ink-4 hover:text-ember' : 'text-border cursor-not-allowed'}`}
        title="Move section up"
        aria-label="Move section up"
      >
        <Icon name="arrow-up" size={10} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className={`inline-flex h-9 w-9 items-center justify-center rounded transition-colors ${canMoveDown ? 'text-ink-4 hover:text-ember' : 'text-border cursor-not-allowed'}`}
        title="Move section down"
        aria-label="Move section down"
      >
        <Icon name="arrow-down" size={10} />
      </button>
    </div>
  )
}
