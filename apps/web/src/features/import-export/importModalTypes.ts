export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export type ImportType = 'json' | 'pdf-embedded' | 'pdf-heuristic'
