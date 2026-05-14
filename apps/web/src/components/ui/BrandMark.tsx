'use client'

import Image from 'next/image'
import { type CSSProperties } from 'react'

interface BrandMarkProps {
  variant?: 'tight' | 'square'
  className?: string
  style?: CSSProperties
}

/**
 * Theme-aware brand mark that switches between white and dark variants.
 */
export function BrandMark({ variant = 'tight', className = '', style }: BrandMarkProps) {
  const isSquare = variant === 'square'
  const defaultSrc = isSquare
    ? '/brand/forge-apps-logo-mark-square-48.png'
    : '/brand/forge-apps-logo-mark-tight.png'
  const whiteSrc = isSquare
    ? '/brand/forge-apps-logo-mark-square-48-white.png'
    : '/brand/forge-apps-logo-mark-tight-white.png'

  return (
    <div className={`brand-mark ${variant} ${className}`} style={style}>
      <Image
        src={defaultSrc}
        alt="Forge Mark"
        className="brand-mark-default"
        width={isSquare ? 48 : 160}
        height={48}
        priority
      />
      <Image
        src={whiteSrc}
        alt="Forge Mark"
        className="brand-mark-white"
        width={isSquare ? 48 : 160}
        height={48}
        priority
      />
    </div>
  )
}
