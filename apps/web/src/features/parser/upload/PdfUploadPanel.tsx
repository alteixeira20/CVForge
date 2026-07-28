'use client'

import { useRef, type ChangeEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import {
  ANALYSIS_FILE_ACCEPT,
  MAX_ANALYSIS_FILE_MEGABYTES,
  MAX_ANALYSIS_PAGES,
} from './analysisFileSupport'

interface PdfUploadPanelProps {
  isAnalyzing: boolean
  onFile: (file: File) => void
}

export function PdfUploadPanel({ isAnalyzing, onFile }: PdfUploadPanelProps) {
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
        aria-labelledby="analyzer-upload-title"
        aria-describedby="analyzer-upload-description"
        className="w-full p-8 lg:p-12 bg-bg-inset border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-[background-color,border-color] group"
      >
        <div className="w-12 h-12 rounded-full bg-bg-2 border border-border-strong flex items-center justify-center mb-4 group-hover:border-ember/50 transition-colors">
          <Icon name="upload" size={16} className="text-ink-3 group-hover:text-ember transition-colors" />
        </div>
        <h3 id="analyzer-upload-title" className="text-sm font-medium text-ink">
          {isAnalyzing ? 'Choose another PDF' : 'Upload PDF'}
        </h3>
        <p id="analyzer-upload-description" className="text-[11px] text-ink-3 mt-1">
          {isAnalyzing
            ? 'The current analysis will be cancelled and safely replaced.'
            : `Choose a PDF up to ${MAX_ANALYSIS_FILE_MEGABYTES} MB and ${MAX_ANALYSIS_PAGES} pages for local checks.`}
        </p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ANALYSIS_FILE_ACCEPT}
        className="hidden"
        aria-label="Choose a PDF for local CV analysis"
        onChange={handleChange}
      />
    </section>
  )
}
