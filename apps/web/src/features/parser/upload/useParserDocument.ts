'use client'

import { useEffect, useState } from 'react'
import { analyzePdfImport } from '@/lib/parser/pdfImport'
import { type ParserDocument } from './parserTypes'

export function useParserDocument() {
  const [document, setDocument] = useState<ParserDocument | null>(null)

  useEffect(() => () => {
    if (document?.objectUrl) URL.revokeObjectURL(document.objectUrl)
  }, [document?.objectUrl])

  const handleFile = async (file: File) => {
    if (!isPdfFile(file)) return setDocument({ fileName: file.name, objectUrl: '', error: 'Choose a PDF file.' })

    const objectUrl = URL.createObjectURL(file)
    const result = await analyzePdfImport(file)

    if (result.success) {
      setDocument({
        fileName: file.name,
        objectUrl,
        ...result.analysis
      })
    } else {
      setDocument({
        fileName: file.name,
        objectUrl,
        error: result.error
      })
    }
  }

  const clearDocument = () => {
    if (document?.objectUrl) URL.revokeObjectURL(document.objectUrl)
    setDocument(null)
  }

  return { document, handleFile, clearDocument }
}

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
