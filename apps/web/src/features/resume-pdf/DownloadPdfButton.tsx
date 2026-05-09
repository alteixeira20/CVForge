'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Icon } from '@/components/ui/Icon'
import { type CVState } from '@/types/cv'
import { ResumePdfDocument } from './ResumePdfDocument'
import { resumePdfFileName } from './resumePdfFileName'
import { embedCVStateAttachment } from './embedCVStateAttachment'

export function DownloadPdfButton({ state }: { state: CVState }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      // 1. Generate base PDF blob
      const blob = await pdf(<ResumePdfDocument state={state} />).toBlob()
      
      // 2. Embed session attachment
      const modifiedBlob = await embedCVStateAttachment(blob, state)
      
      // 3. Trigger download
      const url = URL.createObjectURL(modifiedBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = resumePdfFileName(state)
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className="btn justify-center"
    >
      <Icon name="download" size={14} />
      {isGenerating ? 'Preparing PDF' : 'Download PDF'}
    </button>
  )
}
