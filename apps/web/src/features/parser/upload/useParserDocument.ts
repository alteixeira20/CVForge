'use client'

import { useEffect, useState } from 'react'
import { extractPdfText } from '@/lib/parser/pdfTextExtraction'
import { extractCVForgeAttachment } from '@/lib/parser/extractCVForgeAttachment'
import { type ParserDocument } from './parserTypes'

export function useParserDocument() {
  const [document, setDocument] = useState<ParserDocument | null>(null)

  useEffect(() => () => {
    if (document?.objectUrl) URL.revokeObjectURL(document.objectUrl)
  }, [document?.objectUrl])

  const handleFile = async (file: File) => {
    if (!isPdfFile(file)) return setDocument({ fileName: file.name, objectUrl: '', error: 'Choose a PDF file.' })

    const objectUrl = URL.createObjectURL(file)
    try {
      const [extraction, embeddedState] = await Promise.all([
        extractPdfText(file),
        extractCVForgeAttachment(file)
      ])
      
      setDocument({ fileName: file.name, objectUrl, extraction, embeddedState: embeddedState || undefined })
    } catch {
      setDocument({ fileName: file.name, objectUrl, error: 'PDF text extraction failed for this file.' })
    }
  }

  return { document, handleFile }
}

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
