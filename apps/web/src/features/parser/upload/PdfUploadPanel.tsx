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
    <section className="space-y-16">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="panel w-full p-32 bg-bg-2 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember transition-colors"
      >
        <UploadIcon />
        <h3 className="font-medium text-ink">Upload PDF</h3>
        <p className="text-xs text-ink-3 mt-4">Choose a local PDF for text extraction and diagnostics.</p>
      </button>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleChange} />
    </section>
  )
}

function UploadIcon() {
  return (
    <span className="w-48 h-48 rounded-full bg-bg-3 border border-border-strong flex items-center justify-center mb-16">
      <Icon name="import" size={20} />
    </span>
  )
}
