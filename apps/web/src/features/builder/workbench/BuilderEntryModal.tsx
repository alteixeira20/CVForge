'use client'

import { useRef, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { isEmptyCV } from '@/lib/cvState'
import { Icon } from '@/components/ui/Icon'
import { importCVState } from '@/features/import-export/importCVState'

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
  const { state, resetState, replaceState } = useCV()
  const hasContent = !isEmptyCV(state)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const nextState = await importCVState(file)
      if (window.confirm('Replace the current local CV with this backup?')) {
        replaceState(nextState)
        onComplete()
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed')
    } finally {
      if (event.target) event.target.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: '460px' }}>
        <div className="modal-head">
          <div className="ic plain">
            <Icon name="anvil" size={20} className="text-ember" />
          </div>
          <div className="text">
            <h2>Welcome to CVForge</h2>
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
            onClick={() => fileInputRef.current?.click()}
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
            Private & Secure
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  )
}
