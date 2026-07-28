import { Icon } from '@/components/ui/Icon'

type Props = {
  onAdd: () => void
}

export function AddCustomSectionCard({ onAdd }: Props) {
  return (
    <button
      onClick={onAdd}
      className="w-full p-12 lg:p-16 bg-bg-inset border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-[background-color,border-color] group"
    >
      <div className="w-10 h-10 rounded-full bg-bg-2 border border-border flex items-center justify-center mb-6 group-hover:border-ember/50 transition-colors">
        <Icon name="plus" size={14} className="text-ink-4 group-hover:text-ember transition-colors" />
      </div>
      <h3 className="text-[13px] font-medium text-ink">Add Custom Section</h3>
      <p className="text-[11px] text-ink-3 mt-3">
        Certifications, awards, publications, volunteering, or other CV sections.
      </p>
    </button>
  )
}
