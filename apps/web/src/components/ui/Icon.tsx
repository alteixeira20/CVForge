'use client'

import {
  Anvil,
  Flame,
  Search,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Lock,
  Monitor,
  Users,
  FileDown,
  FileUp,
  Link,
  Circle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  FoldVertical,
  Activity,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Download,
  FileText,
  Settings,
  Trash2,
  GripVertical,
  List,
  AlignLeft,
  type LucideIcon,
} from 'lucide-react'

export type IconName =
  | 'anvil'
  | 'flame'
  | 'search'
  | 'plus'
  | 'x'
  | 'check'
  | 'chevron-right'
  | 'chevron-down'
  | 'moon'
  | 'sun'
  | 'lock'
  | 'device'
  | 'users'
  | 'import'
  | 'export'
  | 'link'
  | 'circle'
  | 'circle-check'
  | 'arrow-right'
  | 'github'
  | 'spark'
  | 'shield'
  | 'fold'
  | 'activity'
  | 'eye'
  | 'eye-off'
  | 'arrow-up'
  | 'arrow-down'
  | 'upload'
  | 'download'
  | 'file-text'
  | 'settings'
  | 'trash'
  | 'grip'
  | 'list'
  | 'align-left'

const iconMap: Record<string, LucideIcon> = {
  anvil: Anvil,
  flame: Flame,
  search: Search,
  plus: Plus,
  x: X,
  check: Check,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  moon: Moon,
  sun: Sun,
  lock: Lock,
  device: Monitor,
  users: Users,
  import: FileDown,
  export: FileUp,
  link: Link,
  circle: Circle,
  'circle-check': CheckCircle2,
  'arrow-right': ArrowRight,
  spark: Sparkles,
  shield: Shield,
  fold: FoldVertical,
  activity: Activity,
  eye: Eye,
  'eye-off': EyeOff,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  upload: Upload,
  download: Download,
  'file-text': FileText,
  settings: Settings,
  trash: Trash2,
  grip: GripVertical,
  list: List,
  'align-left': AlignLeft,
}

export interface IconProps {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
  className?: string
}

export function Icon({
  name,
  size = 16,
  stroke = 'currentColor',
  strokeWidth = 1.6,
  className = '',
}: IconProps) {
  if (name === 'github') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={stroke}
        className={className}
      >
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    )
  }

  const LucideIcon = iconMap[name] || Search

  return (
    <LucideIcon
      size={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}
