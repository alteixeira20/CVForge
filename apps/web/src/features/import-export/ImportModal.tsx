'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { importCVState } from './importCVState'
import { analyzePdfImport, type PdfImportAnalysis } from '@/lib/parser/pdfImport'
import { ImportReviewTable } from './ImportReviewTable'
import { type CVState } from '@/types/cv'

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

  if (!isOpen) return null

  return (
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: importType === 'pdf-heuristic' ? '540px' : '460px' }}>
        <div className="modal-head">
          <div className="ic plain">
            <Icon name={isAnalyzing ? 'loader' : 'import'} size={20} className={isAnalyzing ? 'animate-spin' : ''} />
          </div>
          <div className="text">
            <h2>Import CV Data</h2>
            <p className="sub">
              Restore a JSON backup or import a PDF resume.
            </p>
          </div>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="modal-body">
          {!importType && !isAnalyzing && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 lg:p-10 bg-bg-inset border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:border-ember hover:bg-bg-2 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-bg-2 border border-border-strong flex items-center justify-center mb-4 group-hover:border-ember/50 transition-colors">
                  <Icon name="upload" size={16} className="text-ink-3 group-hover:text-ember transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-ink">Choose File</h3>
                <p className="text-[11px] text-ink-3 mt-1">Select a .json backup or .pdf resume.</p>
              </button>

              <div className="p-4 rounded-lg bg-bg-2 border border-border-faint">
                <div className="flex gap-10 items-start">
                  <Icon name="shield" size={14} className="text-ember mt-1 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-ink">Local-first Import</p>
                    <p className="text-[11px] text-ink-3 leading-relaxed">
                      Importing a file will replace your current local builder data. 
                      External PDF import is heuristic and requires manual verification.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-amber-200/80 bg-amber-200/5 p-3 rounded-lg border border-amber-200/20 italic">
                  {error}
                </p>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-10 h-10 border-2 border-ember border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-ink-3">Analyzing document structure...</p>
            </div>
          )}

          {importType === 'json' && pendingState && (
            <div className="space-y-6 py-2">
              <div className="p-4 rounded-lg bg-ember/5 border border-ember/20 space-y-3">
                <div className="flex items-center gap-10">
                  <Icon name="check" size={16} className="text-ember" />
                  <h3 className="text-sm font-semibold text-ink">Valid Backup Found</h3>
                </div>
                <p className="text-xs text-ink-3 leading-relaxed">
                  Ready to restore session for 
                  <strong className="text-ink ml-1">{pendingState.resume.profile.name || 'Anonymous User'}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={handleConfirm} className="btn primary w-full justify-center h-11">
                  Replace current CV & Restore
                </button>
                <button type="button" onClick={handleCancelPending} className="btn w-full justify-center h-11">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {importType === 'pdf-embedded' && pendingState && (
            <div className="space-y-6 py-2">
              <div className="p-4 rounded-lg bg-ember/5 border border-ember/20 space-y-3">
                <div className="flex items-center gap-10">
                  <Icon name="shield-check" size={16} className="text-ember" />
                  <h3 className="text-sm font-semibold text-ink">CVForge Session Detected</h3>
                </div>
                <p className="text-xs text-ink-3 leading-relaxed">
                  This PDF contains a saved CVForge session for 
                  <strong className="text-ink ml-1">{pendingState.resume.profile.name || 'Anonymous User'}</strong>. 
                  The Builder can perform a high-fidelity restore of this structured state.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={handleConfirm} className="btn primary w-full justify-center h-11">
                  Restore Embedded Session
                </button>
                <button type="button" onClick={handleCancelPending} className="btn w-full justify-center h-11">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {importType === 'pdf-heuristic' && analysis?.heuristic && (
            <div className="space-y-6 py-2">
              <div className="space-y-4">
                <div className="flex items-start gap-10 p-4 rounded-lg bg-bg-2 border border-border-faint">
                  <Icon name="shield" size={16} className="text-molten mt-1 shrink-0" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-ink">Best-Effort Draft Review</h3>
                    <p className="text-[11px] text-ink-3 leading-relaxed">
                      External PDF import is heuristic and may be incomplete. If the CV uses complex layouts, fields may be missing. 
                      <span className="font-semibold text-ink ml-1">Manual review is required.</span>
                    </p>
                  </div>
                </div>

                <ImportReviewTable result={analysis.heuristic} />

                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] text-ink-4 uppercase tracking-widest font-semibold">
                    Confidence: {analysis.heuristic.confidence}%
                  </span>
                  <div className="flex gap-2">
                    {analysis.heuristic.warnings.slice(0, 1).map(w => (
                      <span key={w} className="text-[10px] text-amber-200 italic">{w}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={handleConfirm} className="btn primary w-full justify-center h-11">
                  Create Editable Draft
                </button>
                <button type="button" onClick={handleCancelPending} className="btn w-full justify-center h-11">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <div className="note">
            <Icon name="lock" size={12} />
            <span>Private & Local</span>
          </div>
          <div className="spacer" />
          <p className="text-[10px] uppercase tracking-widest text-ink-4">
            CVForge
          </p>
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
  )
}
