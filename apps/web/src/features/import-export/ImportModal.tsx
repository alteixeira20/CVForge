'use client'

import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { importCVState } from './importCVState'
import { analyzePdfImport, type PdfImportAnalysis } from '@/lib/parser/pdfImport'
import { type CVState } from '@/types/cv'
import { ImportFileDropzone } from './ImportFileDropzone'
import { ImportConfirmStep } from './ImportConfirmStep'
import { PdfHeuristicReview } from './PdfHeuristicReview'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type ImportType = 'json' | 'pdf-embedded' | 'pdf-heuristic'

export function ImportModal({ isOpen, onClose, onComplete }: ImportModalProps) {
  const { replaceState } = useCV()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importType, setImportType] = useState<ImportType | null>(null)
  const [pendingState, setPendingState] = useState<CVState | null>(null)
  const [analysis, setAnalysis] = useState<PdfImportAnalysis | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setPendingState(null)
    setAnalysis(null)
    setImportType(null)
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
      onClose()
      onComplete?.()
    }
  }

  const handleCancelPending = () => {
    setPendingState(null)
    setAnalysis(null)
    setImportType(null)
  }

  if (!isOpen || typeof document === 'undefined') return null

  const modalWidth = importType === 'pdf-heuristic' ? '540px' : '460px'
  const ownerName = pendingState?.resume.profile.name || 'Anonymous User'

  return createPortal((
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ '--modal-width': modalWidth } as CSSProperties}>
        <div className="modal-head">
          <div className="ic plain">
            <Icon name={isAnalyzing ? 'circle' : 'import'} size={20} className={isAnalyzing ? 'animate-spin' : ''} />
          </div>
          <div className="text">
            <h2>Import CV Data</h2>
            <p className="sub">Restore a JSON backup or import a PDF resume.</p>
          </div>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="modal-body">
          {!importType && !isAnalyzing && (
            <ImportFileDropzone onFileSelect={() => fileInputRef.current?.click()} error={error} />
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-10 h-10 border-2 border-ember border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-ink-3">Analyzing document structure...</p>
            </div>
          )}

          {importType === 'json' && pendingState && (
            <ImportConfirmStep
              icon="check"
              title="Valid Backup Found"
              description={<>Ready to restore session for <strong className="text-ink ml-1">{ownerName}</strong>.</>}
              confirmLabel="Replace current CV & Restore"
              onConfirm={handleConfirm}
              onCancel={handleCancelPending}
            />
          )}

          {importType === 'pdf-embedded' && pendingState && (
            <ImportConfirmStep
              icon="circle-check"
              title="CVForge Session Detected"
              description={<>This PDF contains a saved CVForge session for <strong className="text-ink ml-1">{ownerName}</strong>. The Builder can perform a high-fidelity restore of this structured state.</>}
              confirmLabel="Restore Embedded Session"
              onConfirm={handleConfirm}
              onCancel={handleCancelPending}
            />
          )}

          {importType === 'pdf-heuristic' && analysis?.heuristic && (
            <PdfHeuristicReview
              result={analysis.heuristic}
              onConfirm={handleConfirm}
              onCancel={handleCancelPending}
            />
          )}
        </div>

        <div className="modal-foot">
          <div className="note">
            <Icon name="lock" size={12} />
            <span>Private & Local</span>
          </div>
          <div className="spacer" />
          <p className="text-[10px] uppercase tracking-widest text-ink-4">CVForge</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json,application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  ), document.body)
}
