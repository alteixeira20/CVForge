interface EmptySectionStateProps {
  children: string
}

export function EmptySectionState({ children }: EmptySectionStateProps) {
  return (
    <div className="py-3 px-4 text-center border border-dashed border-border-faint rounded-lg select-none">
      <p className="text-xs text-ink-4">{children}</p>
    </div>
  )
}
