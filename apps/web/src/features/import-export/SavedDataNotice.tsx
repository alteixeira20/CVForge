'use client'

import { useState } from 'react'
import { useCV } from '@/context/CVContext'
import { type UnreadableSavedCV } from '@/context/useCVPersistence'
import { downloadBlob } from '@/lib/downloadBlob'

const COPY = {
  newer: {
    title: 'This CV was saved by a newer version of CVForge',
    body: 'This page is running an older version, so it cannot open the saved CV safely. The saved CV has not been changed. Reload to get the latest version, or download the saved data as a file.',
  },
  damaged: {
    title: 'Your saved CV could not be opened',
    body: 'The CV saved in this browser is damaged or incomplete. It has not been changed, and a recovery copy is kept in this browser. Download the saved data as a file to keep it.',
  },
} as const

// Shown while an unreadable saved CV blocks autosave. Nothing is written to
// the saved CV until the user explicitly replaces it.
export function SavedDataNotice() {
  const { persistence } = useCV()
  const [isConfirming, setIsConfirming] = useState(false)
  const unreadable = persistence.unreadable
  if (persistence.status === 'ready' && persistence.changedInAnotherTab) {
    return <OtherTabNotice onKeep={persistence.keepThisTabVersion} />
  }
  if (persistence.status !== 'blocked' || !unreadable) return null

  const copy = unreadable.reason === 'unsupported-version' ? COPY.newer : COPY.damaged

  return (
    <section
      className="saved-data-notice"
      role="alert"
      aria-labelledby="saved-data-notice-title"
    >
      <div className="saved-data-notice-text">
        <h2 id="saved-data-notice-title">{copy.title}</h2>
        <p>{copy.body}</p>
        <p>Changes you make now are not saved until you choose an option.</p>
      </div>
      {isConfirming
        ? <ReplaceConfirmation onConfirm={persistence.replaceUnreadableSavedCV} onCancel={() => setIsConfirming(false)} />
        : <NoticeActions unreadable={unreadable} onStartFresh={() => setIsConfirming(true)} />}
    </section>
  )
}

function OtherTabNotice({ onKeep }: { onKeep: () => void }) {
  return (
    <section className="saved-data-notice" role="alert" aria-labelledby="saved-data-notice-title">
      <div className="saved-data-notice-text">
        <h2 id="saved-data-notice-title">This CV was changed in another tab</h2>
        <p>
          To avoid overwriting those changes, this tab has stopped saving. Reload to continue
          with the latest saved CV, or keep the version shown here.
        </p>
      </div>
      <div className="saved-data-notice-actions">
        <button type="button" className="btn sm" onClick={() => window.location.reload()}>
          Reload
        </button>
        <button type="button" className="btn sm" onClick={onKeep}>
          Keep this tab&apos;s version
        </button>
      </div>
    </section>
  )
}

function NoticeActions({ unreadable, onStartFresh }: {
  unreadable: UnreadableSavedCV
  onStartFresh: () => void
}) {
  const canReload = unreadable.reason === 'unsupported-version'

  return (
    <div className="saved-data-notice-actions">
      <button type="button" className="btn sm" onClick={() => downloadSavedData(unreadable.raw)}>
        Download saved data
      </button>
      {canReload && (
        <button type="button" className="btn sm" onClick={() => window.location.reload()}>
          Reload
        </button>
      )}
      <button type="button" className="btn sm" onClick={onStartFresh}>
        Start fresh
      </button>
    </div>
  )
}

function ReplaceConfirmation({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="saved-data-notice-actions">
      <p className="saved-data-notice-confirm">
        Replace the saved CV with the CV shown here? Download the saved data first if you may need it.
      </p>
      <button type="button" className="btn sm" onClick={onConfirm}>
        Replace saved CV
      </button>
      <button type="button" className="btn sm" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

function downloadSavedData(raw: string) {
  const blob = new Blob([raw], { type: 'application/json' })
  downloadBlob(blob, 'cvforge-saved-data.json')
}
