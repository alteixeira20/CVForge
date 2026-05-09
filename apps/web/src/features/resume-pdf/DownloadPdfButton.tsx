'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Icon } from '@/components/ui/Icon'
import { type CVState } from '@/types/cv'
import { ResumePdfDocument } from './ResumePdfDocument'
import { resumePdfFileName } from './resumePdfFileName'

export function DownloadPdfButton({ state }: { state: CVState }) {
  return (
    <PDFDownloadLink
      document={<ResumePdfDocument state={state} />}
      fileName={resumePdfFileName(state)}
      className="btn justify-center"
    >
      {({ loading }) => (
        <>
          <Icon name="export" size={14} />
          {loading ? 'Preparing PDF' : 'Download PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}
