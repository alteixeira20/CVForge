'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useCV } from '@/context/CVContext'
import { ImportModal } from '@/features/import-export/ImportModal'
import { useDialogFocus } from '@/hooks/useDialogFocus'
import { isEmptyCV } from '@/lib/cvState'

interface BuilderEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function BuilderEntryModal({
  isOpen,
  onClose,
  onComplete,
}: BuilderEntryModalProps) {
  const { state, resetState } = useCV()
  const hasContent = !isEmptyCV(state)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const flowTriggerRef = useRef<HTMLElement | null>(null)
  const importButtonRef = useRef<HTMLButtonElement>(null)
  const returnToImportRef = useRef(false)
  const wasOpenRef = useRef(false)
  if (isOpen && !wasOpenRef.current && typeof document !== 'undefined') {
    flowTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
  }
  const dialogRef = useDialogFocus(isOpen && !isImportModalOpen, onClose, {
    restoreFocus: !isImportModalOpen,
    returnFocusRef: flowTriggerRef,
  })

  useEffect(() => {
    wasOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isImportModalOpen || !returnToImportRef.current) return

    const animationFrame = window.requestAnimationFrame(() => {
      importButtonRef.current?.focus({ preventScroll: true })
      returnToImportRef.current = false
    })
    return () => window.cancelAnimationFrame(animationFrame)
  }, [isImportModalOpen, isOpen])

  const handleStartFresh = () => {
    const shouldReplace = !hasContent ||
      window.confirm('This will replace your current local CV. Continue?')
    if (!shouldReplace) return

    resetState()
    onComplete()
  }

  const openImportModal = () => {
    returnToImportRef.current = true
    setIsImportModalOpen(true)
  }

  if (!isOpen) return null

  return (
    <>
      {!isImportModalOpen && (
        <div className="modal-scrim" onClick={(event) => event.target === event.currentTarget && onClose()}>
          <div
            ref={dialogRef}
            className="modal"
            style={{ '--modal-width': '460px' } as CSSProperties}
            role="dialog"
            aria-modal="true"
            aria-labelledby="builder-entry-modal-title"
            aria-describedby="builder-entry-modal-description"
            tabIndex={-1}
          >
            <div className="modal-head">
              <div className="ic plain">
                <Image
                  src="/brand/anvilary-logo-mark-square-48-white.png"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <div className="text">
                <h2 id="builder-entry-modal-title">Start with CVForge</h2>
                <p className="sub" id="builder-entry-modal-description">
                  Continue safely, begin a new CV, or restore work from a file.
                </p>
              </div>
              <button type="button" className="close" onClick={onClose} aria-label="Close">
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="modal-body builder-entry-body">
              {hasContent && (
                <EntryChoice
                  icon="arrow-right"
                  label="Continue current CV"
                  detail="Open the CV saved in this browser"
                  primary
                  onClick={onComplete}
                />
              )}

              <EntryChoice
                icon="plus"
                label="Start a new CV"
                detail={hasContent
                  ? 'Confirmation required before replacement'
                  : 'Begin with a blank structured CV'}
                primary={!hasContent}
                onClick={handleStartFresh}
              />

              <EntryChoice
                buttonRef={importButtonRef}
                icon="import"
                label="Restore or import"
                detail="JSON backup or reviewed PDF import"
                onClick={openImportModal}
              />
            </div>

            <div className="modal-foot">
              <div className="note">
                <Icon name="lock" size={12} />
                <span>Files are processed locally</span>
              </div>
              <div className="spacer" />
              <p className="modal-foot-label">No account required</p>
            </div>
          </div>
        </div>
      )}

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onComplete={onComplete}
        restoreFocus={false}
      />
    </>
  )
}

interface EntryChoiceProps {
  buttonRef?: React.Ref<HTMLButtonElement>
  detail: string
  icon: 'arrow-right' | 'import' | 'plus'
  label: string
  onClick: () => void
  primary?: boolean
}

function EntryChoice({
  buttonRef,
  detail,
  icon,
  label,
  onClick,
  primary = false,
}: EntryChoiceProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={`btn entry-choice ${primary ? 'primary' : ''}`}
    >
      <span className="entry-choice-main">
        <Icon name={icon} size={16} />
        <span>
          <strong>{label}</strong>
          <small>{detail}</small>
        </span>
      </span>
    </button>
  )
}
