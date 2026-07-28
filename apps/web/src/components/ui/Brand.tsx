'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BrandProps {
  href?: string
  className?: string
}

/** Anvilary product brand: shared logo mark plus the CVForge wordmark. */
export function Brand({ href, className = 'brand' }: BrandProps) {
  const inner = (
    <>
      <span className="brand-logo" aria-hidden="true">
        <Image
          src="/brand/anvilary-logo-mark-tight-white.png"
          alt=""
          width={24}
          height={28}
        />
      </span>
      <span>CVForge</span>
    </>
  )

  if (href) {
    return <Link href={href} className={className}>{inner}</Link>
  }

  return <div className={className}>{inner}</div>
}