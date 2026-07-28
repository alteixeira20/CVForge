'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface DialogFocusOptions {
  initialFocusRef?: RefObject<HTMLElement | null>
  restoreFocus?: boolean
  returnFocusRef?: RefObject<HTMLElement | null>
}

let bodyLockCount = 0
let bodyOverflowBeforeLock = ''
const activeDialogs: symbol[] = []

function lockBodyScroll() {
  if (bodyLockCount === 0) {
    bodyOverflowBeforeLock = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  bodyLockCount += 1
}

function unlockBodyScroll() {
  bodyLockCount = Math.max(0, bodyLockCount - 1)
  if (bodyLockCount === 0) {
    document.body.style.overflow = bodyOverflowBeforeLock
  }
}

function isActuallyFocusable(element: HTMLElement) {
  if (!element.isConnected || element.matches(':disabled, [aria-hidden="true"]')) return false
  if (element.closest('[inert], [aria-hidden="true"]')) return false

  const style = window.getComputedStyle(element)
  return style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getClientRects().length > 0
}

function getFocusableElements(dialog: HTMLElement) {
  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(isActuallyFocusable)
}

/**
 * Shared dialog behavior: Escape close, Tab focus trap, body scroll lock,
 * and focus hand-off into and back out of the dialog with preventScroll so
 * opening or closing never shifts the page.
 */
export function useDialogFocus(
  isActive: boolean,
  onClose: () => void,
  options: DialogFocusOptions = {},
): RefObject<HTMLDivElement | null> {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const optionsRef = useRef(options)
  const dialogIdRef = useRef(Symbol('dialog'))
  onCloseRef.current = onClose
  optionsRef.current = options

  useEffect(() => {
    if (!isActive) return
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialogId = dialogIdRef.current
    activeDialogs.push(dialogId)
    lockBodyScroll()

    const initialFocus =
      optionsRef.current.initialFocusRef?.current ??
      getFocusableElements(dialog)[0] ??
      dialog
    initialFocus.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeDialogs.at(-1) !== dialogId) return

      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(dialog)
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const activeIndex = active instanceof HTMLElement ? focusable.indexOf(active) : -1

      if (event.shiftKey && activeIndex <= 0) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (
        !event.shiftKey &&
        (activeIndex === -1 || activeIndex === focusable.length - 1)
      ) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const dialogIndex = activeDialogs.lastIndexOf(dialogId)
      if (dialogIndex >= 0) activeDialogs.splice(dialogIndex, 1)
      unlockBodyScroll()

      if (optionsRef.current.restoreFocus === false) return
      const returnTarget = optionsRef.current.returnFocusRef?.current ?? previouslyFocused
      if (returnTarget && isActuallyFocusable(returnTarget)) {
        returnTarget.focus({ preventScroll: true })
      }
    }
  }, [isActive])

  return dialogRef
}
