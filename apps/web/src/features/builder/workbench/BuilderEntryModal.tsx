'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { isEmptyCV } from '@/lib/cvState'
import { Icon } from '@/components/ui/Icon'
import { BrandMark } from '@/components/ui/BrandMark'
import { ImportModal } from '@/features/import-export/ImportModal'

interface BuilderEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function BuilderEntryModal({ 
  isOpen, 
  onClose,
  onComplete 
}: BuilderEntryModalProps) {
  const { state, resetState } = useCV()
  const hasContent = !isEmptyCV(state)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const handleContinue = () => {
    onComplete()
  }

  const handleStartFresh = () => {
    if (hasContent) {
      if (window.confirm('This will replace your current local CV. Continue?')) {
        resetState()
        onComplete()
      }
    } else {
      resetState()
      onComplete()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div
          className="modal"
          style={{ width: '460px' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="builder-entry-modal-title"
        >
          <div className="modal-head">
            <div className="ic plain">
              <BrandMark variant="square" className="w-10 h-10" />
            </div>
            <div className="text">
              <h2 id="builder-entry-modal-title">Welcome to CVForge</h2>
              <p className="sub">
                Your data is stored locally in your browser. No account required.
              </p>
            </div>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={16} />
            </button>
          </div>

          <div className="modal-body" style={{ gap: '12px', paddingBottom: '24px' }}>
            {hasContent && (
              <button
                type="button"
                onClick={handleContinue}
                className="btn primary w-full justify-between h-[52px]"
              >
                <span>Continue current CV</span>
                <Icon name="arrow-right" size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={handleStartFresh}
              className={`btn w-full justify-between h-[52px] ${!hasContent ? 'primary' : ''}`}
            >
              <div className="flex items-center gap-12">
                <Icon name="plus" size={16} />
                <span>Start fresh</span>
              </div>
              {!hasContent && <Icon name="arrow-right" size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="btn w-full justify-between h-[52px]"
            >
              <div className="flex items-center gap-12">
                <Icon name="import" size={16} />
                <span>Import JSON</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider opacity-50">.json backup</span>
            </button>
          </div>

          <div className="modal-foot">
            <div className="note">
              <Icon name="lock" size={12} />
              <span>Local-only storage</span>
            </div>
            <div className="spacer" />
            <p className="text-[10px] uppercase tracking-widest text-ink-4">
              Private & Local
            </p>
          </div>
        </div>
      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onComplete={onComplete}
      />
    </>
  )
}
