export function PreviewErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-12 text-center">
      <p className="max-w-xs text-xs leading-relaxed text-red-300 bg-red-500/10 border border-red-500/20 px-12 py-8 rounded-lg">
        {message}
      </p>
    </div>
  )
}
