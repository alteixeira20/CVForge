'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Icon } from '@/components/ui/Icon'
import { type CVState } from '@/types/cv'
import { ResumePdfDocument } from './ResumePdfDocument'
import { resumePdfFileName } from './resumePdfFileName'
import { embedCVStateAttachment } from './embedCVStateAttachment'
import { announce } from '@/lib/accessibility/announce'

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
      announce('PDF export completed.')
    } catch (error) {
      console.error('PDF generation failed:', error)
      announce('PDF export failed. Review the current CV and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className="btn sm justify-center bg-bg-2/80 backdrop-blur-sm border-border shadow-sm"
    >
      <Icon name="download" size={13} />
      {isGenerating ? 'Preparing' : 'Download'}
    </button>
  )
}
