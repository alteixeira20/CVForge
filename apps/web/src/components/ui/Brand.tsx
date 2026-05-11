'use client'

import Link from 'next/link'
import { BrandMark } from './BrandMark'

interface BrandProps {
  href?: string
}

export function Brand({ href }: BrandProps) {
  const inner = (
    <>
      <BrandMark variant="tight" style={{ width: '42px' }} />
      <span>CVForge</span>
    </>
  )

  if (href) {
    return <Link href={href} className="brand">{inner}</Link>
  }

  return <div className="brand">{inner}</div>
}
