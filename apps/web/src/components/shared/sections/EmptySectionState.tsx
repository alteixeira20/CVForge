interface EmptySectionStateProps {
  children: string
}

export function EmptySectionState({ children }: EmptySectionStateProps) {
  return (
    <div className="p-32 text-center border-2 border-dashed border-border-faint rounded-xl opacity-50 select-none">
      <p className="text-xs text-ink-4 uppercase tracking-widest">{children}</p>
    </div>
  )
}
