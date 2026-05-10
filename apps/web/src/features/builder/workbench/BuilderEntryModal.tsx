'use client'

import { useEffect, useState, useRef, type ChangeEvent } from 'react'
import { useCV } from '@/context/CVContext'
import { isEmptyCV } from '@/lib/cvState'
import { Icon } from '@/components/ui/Icon'
import { importCVState } from '@/features/import-export/importCVState'

const SESSION_KEY = 'cvforge_builder_entry_seen'

export function BuilderEntryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { state, resetState, replaceState } = useCV()
  const hasContent = !isEmptyCV(state)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY)
    if (!seen) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, 'true')
    setIsOpen(false)
  }

  const handleStartFresh = () => {
    if (hasContent) {
      if (window.confirm('This will replace your current local CV. Continue?')) {
        resetState()
        handleClose()
      }
    } else {
      resetState()
      handleClose()
    }
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const nextState = await importCVState(file)
      if (window.confirm('Replace the current local CV with this backup?')) {
        replaceState(nextState)
        handleClose()
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed')
    } finally {
      event.target.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-24">
      <div className="w-full max-w-[480px] bg-bg-2 border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-32 space-y-24">
          <div className="space-y-8 text-center">
            <div className="w-48 h-48 rounded-2xl bg-bg border border-border flex items-center justify-center mx-auto shadow-sm">
              <Icon name="anvil" size={24} className="text-ember" />
            </div>
            <h2 className="text-xl font-semibold text-ink">Welcome to CVForge</h2>
            <p className="text-sm text-ink-3 leading-relaxed">
              CVForge stores your data locally in your browser. 
              No account is required and no data ever leaves your machine.
            </p>
          </div>

          <div className="space-y-12">
            {hasContent ? (
              <button
                onClick={handleClose}
                className="btn primary w-full justify-center h-48"
              >
                Continue current CV
              </button>
            ) : null}

            <button
              onClick={handleStartFresh}
              className={`btn w-full justify-center h-48 ${!hasContent ? 'primary' : 'bg-bg'}`}
            >
              <Icon name="plus" size={16} />
              Start fresh
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn w-full justify-center h-48 bg-bg"
            >
              <Icon name="import" size={16} />
              Import JSON
            </button>
          </div>

          <div className="pt-8 border-t border-border-faint text-center">
            <p className="text-[10px] uppercase tracking-widest text-ink-4">
              JSON is the reliable backup path
            </p>
          </div>
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
