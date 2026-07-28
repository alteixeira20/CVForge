export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  restoreFocus?: boolean
}

export type ImportType = 'json' | 'pdf-embedded' | 'pdf-heuristic'
