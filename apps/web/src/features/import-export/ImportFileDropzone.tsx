'use client'

import { Icon } from '@/components/ui/Icon'

interface ImportFileDropzoneProps {
  onFileSelect: () => void
  error: string | null
}

export function ImportFileDropzone({ onFileSelect, error }: ImportFileDropzoneProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onFileSelect}
        aria-labelledby="import-file-title"
        aria-describedby="import-file-description"
        className="w-full p-8 lg:p-10 bg-bg-inset border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-bg-2 border border-border-strong flex items-center justify-center mb-4 group-hover:border-ember/50 transition-colors">
          <Icon name="upload" size={16} className="text-ink-3 group-hover:text-ember transition-colors" />
        </div>
        <h3 id="import-file-title" className="text-sm font-medium text-ink">Choose File</h3>
        <p id="import-file-description" className="text-[11px] text-ink-3 mt-1">Select a .json backup or .pdf resume.</p>
      </button>

      <div className="p-4 rounded-lg bg-bg-2 border border-border-faint">
        <div className="flex gap-10 items-start">
          <Icon name="shield" size={14} className="text-ember mt-1 shrink-0" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-ink">Local-first Import</p>
            <p className="text-[11px] text-ink-3 leading-relaxed">
              Importing a file will replace your current local builder data.
              External PDF import is heuristic and requires manual verification.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-200/80 bg-amber-200/5 p-3 rounded-lg border border-amber-200/20 italic">
          {error}
        </p>
      )}
    </div>
  )
}
