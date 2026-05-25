'use client'

import { GitHubIcon } from './GitHubIcon'
import { fallbackIcon, iconMap } from './iconRegistry'
import { type IconProps } from './iconTypes'

export type { IconName, IconProps } from './iconTypes'

export function Icon({
  name,
  size = 16,
  stroke = 'currentColor',
  strokeWidth = 1.6,
  className = '',
}: IconProps) {
  if (name === 'github') {
    return <GitHubIcon size={size} stroke={stroke} className={className} />
  }

  const LucideIcon = iconMap[name] || fallbackIcon

  return (
    <LucideIcon
      size={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}
