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

export interface IconProps {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
  className?: string
}
