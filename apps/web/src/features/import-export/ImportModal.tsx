'use client'

import { type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/ui/Icon'
import { ImportFileDropzone } from './ImportFileDropzone'
import { ImportConfirmStep } from './ImportConfirmStep'
import { PdfHeuristicReview } from './PdfHeuristicReview'
import { type ImportModalProps } from './importModalTypes'
import { useImportModalFlow } from './useImportModalFlow'
import { useDialogFocus } from '@/hooks/useDialogFocus'

export function ImportModal({
  isOpen,
  onClose,
  onComplete,
  restoreFocus = true,
}: ImportModalProps) {
  const {
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
  } = useImportModalFlow({ onClose, onComplete })
  const handleClose = () => {
    resetPendingImport()
    onClose()
  }
  const dialogRef = useDialogFocus(isOpen, handleClose, { restoreFocus })

  if (!isOpen || typeof document === 'undefined') return null

  const modalWidth = importType === 'pdf-heuristic' ? '540px' : '460px'
  const ownerName = pendingState?.resume.profile.name || 'Anonymous User'

  return createPortal((
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        ref={dialogRef}
        className="modal"
        style={{ '--modal-width': modalWidth } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-modal-title"
        aria-describedby="import-modal-description"
        tabIndex={-1}
      >
        <div className="modal-head">
          <div className="ic plain">
            <Icon name={isAnalyzing ? 'circle' : 'import'} size={20} className={isAnalyzing ? 'animate-spin' : ''} />
          </div>
          <div className="text">
            <h2 id="import-modal-title">Import CV Data</h2>
            <p className="sub" id="import-modal-description">
              Restore a reliable JSON backup or review a PDF import.
            </p>
          </div>
          <button type="button" className="close" onClick={handleClose} aria-label="Close import">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="modal-body">
          {!importType && !isAnalyzing && (
            <ImportFileDropzone onFileSelect={openFileDialog} error={error} />
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center" role="status" aria-live="polite">
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
        aria-label="Choose a JSON backup or PDF resume to import"
        onChange={handleFileChange}
      />
    </div>
  ), document.body)
}
