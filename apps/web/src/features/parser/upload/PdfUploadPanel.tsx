'use client'

import { useRef, type ChangeEvent } from 'react'
import { Icon } from '@/components/ui/Icon'

export function PdfUploadPanel({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onFile(file)
    event.target.value = ''
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-labelledby="parser-upload-title"
        aria-describedby="parser-upload-description"
        className="w-full p-8 lg:p-12 bg-bg-inset border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-bg-2 border border-border-strong flex items-center justify-center mb-4 group-hover:border-ember/50 transition-colors">
          <Icon name="upload" size={16} className="text-ink-3 group-hover:text-ember transition-colors" />
        </div>
        <h3 id="parser-upload-title" className="text-sm font-medium text-ink">Upload PDF</h3>
        <p id="parser-upload-description" className="text-[11px] text-ink-3 mt-1">Choose a local PDF for extraction diagnostics.</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        aria-label="Choose a PDF for extraction diagnostics"
        onChange={handleChange}
      />
    </section>
  )
}
