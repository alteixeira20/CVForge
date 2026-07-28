'use client'

import { useEffect, useState } from 'react'
import { analyzePdfImport } from '@/lib/parser/pdfImport'
import { isSupportedAnalysisFile } from './analysisFileSupport'
import { type ParserDocument } from './parserTypes'

export function useParserDocument() {
  const [document, setDocument] = useState<ParserDocument | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => () => {
    if (document?.objectUrl) URL.revokeObjectURL(document.objectUrl)
  }, [document?.objectUrl])

  const handleFile = async (file: File) => {
    if (!isSupportedAnalysisFile(file)) {
      return setDocument({
        fileName: file.name,
        objectUrl: '',
        error: 'CVForge currently analyzes PDF files only. DOCX and plain-text analysis are not supported yet.',
      })
    }

    const objectUrl = URL.createObjectURL(file)
    setIsAnalyzing(true)
    try {
      const result = await analyzePdfImport(file)
      if (result.success) {
        setDocument({
          fileName: file.name,
          objectUrl,
          ...result.analysis,
        })
      } else {
        setDocument({
          fileName: file.name,
          objectUrl,
          error: result.error,
        })
      }
    } catch (error) {
      setDocument({
        fileName: file.name,
        objectUrl,
        error: error instanceof Error
          ? error.message
          : 'CVForge could not analyze this PDF.',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearDocument = () => {
    if (document?.objectUrl) URL.revokeObjectURL(document.objectUrl)
    setDocument(null)
  }

  return { document, isAnalyzing, handleFile, clearDocument }
}
