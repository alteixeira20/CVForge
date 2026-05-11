'use client'

interface BrandMarkProps {
  variant?: 'tight' | 'square'
  className?: string
  style?: React.CSSProperties
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
      <img src={defaultSrc} alt="Forge Mark" className="brand-mark-default" loading="eager" />
      <img src={whiteSrc} alt="Forge Mark" className="brand-mark-white" loading="eager" />
    </div>
  )
}
