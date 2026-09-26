'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { analyzePdfImport, type PdfImportAnalysis } from '@/lib/parser/pdfImport'
import { type CVState } from '@/types/cv'
import { importCVState } from './importCVState'
import { announce } from '@/lib/accessibility/announce'
import { markCVImported } from '@/features/builder/workbench/importExpansion'
import { type ImportModalProps, type ImportType } from './importModalTypes'

type ImportModalFlowOptions = Pick<ImportModalProps, 'onClose' | 'onComplete'>

export function useImportModalFlow({ onClose, onComplete }: ImportModalFlowOptions) {
  const { replaceState } = useCV()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importType, setImportType] = useState<ImportType | null>(null)
  const [pendingState, setPendingState] = useState<CVState | null>(null)
  const [analysis, setAnalysis] = useState<PdfImportAnalysis | null>(null)

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    resetPendingImport()
    setError(null)
    setIsAnalyzing(true)

    try {
      const fileName = file.name.toLowerCase()

      if (fileName.endsWith('.json')) {
        const nextState = await importCVState(file)
        setPendingState(nextState)
        setImportType('json')
      } else if (fileName.endsWith('.pdf')) {
        const result = await analyzePdfImport(file)
        if (result.success) {
          setAnalysis(result.analysis)
          if (result.analysis.embeddedState) {
            setPendingState(result.analysis.embeddedState)
            setImportType('pdf-embedded')
          } else if (result.analysis.heuristic) {
            setPendingState(result.analysis.heuristic.draft)
            setImportType('pdf-heuristic')
          } else {
            setError('Could not extract meaningful CV data from this PDF.')
          }
        } else {
          setError(result.error)
        }
      } else {
        setError('Only .json backup files and .pdf resumes are supported.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed. Check the file and try again.')
    } finally {
      setIsAnalyzing(false)
      if (event.target) event.target.value = ''
    }
  }

  const handleConfirm = () => {
    if (pendingState) {
      replaceState(pendingState)
      markCVImported(pendingState)
      announce('Import completed. The reviewed CV data is now active in Builder.')
      resetPendingImport()
      onClose()
      onComplete?.()
    }
  }

  const handleCancelPending = () => {
    resetPendingImport()
  }

  function resetPendingImport() {
    setPendingState(null)
    setAnalysis(null)
    setImportType(null)
  }

  return {
    analysis,
    error,
    fileInputRef,
    handleCancelPending,
    handleConfirm,
    handleFileChange,
    importType,
    isAnalyzing,
    openFileDialog,
    pendingState,
    resetPendingImport,
  }
}
