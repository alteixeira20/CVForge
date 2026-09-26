export function PreviewErrorState({ message, onRetry }: { message: string, onRetry: () => void }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center sm:p-12" role="alert">
      <div className="max-w-xs space-y-4 rounded-lg border border-red-500/20 bg-red-500/10 px-6 py-6 sm:px-12 sm:py-8">
        <p className="text-xs leading-relaxed text-red-300">{message}</p>
        <button type="button" className="btn sm" onClick={onRetry}>
          Retry preview
        </button>
      </div>
    </div>
  )
}
