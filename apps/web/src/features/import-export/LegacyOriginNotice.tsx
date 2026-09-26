'use client'

import { useEffect, useState } from 'react'
import { useCV } from '@/context/CVContext'
import { isEmptyCV } from '@/lib/cvState'
import { LEGACY_HOSTNAMES, siteConfig } from '@/lib/siteConfig'
import { exportCVState } from './exportCVState'

// Browser storage is scoped to the origin, so a CV saved at a previous
// address does not appear at the new one. On a previous address, explain the
// move and offer the JSON backup that the new address can import.
export function LegacyOriginNotice() {
  const { state, persistence } = useCV()
  const [isLegacyHost, setIsLegacyHost] = useState(false)

  useEffect(() => {
    setIsLegacyHost(LEGACY_HOSTNAMES.includes(window.location.hostname))
  }, [])

  if (!isLegacyHost) return null
  const newHost = new URL(siteConfig.url).host
  const canExport = persistence.status === 'ready' && !isEmptyCV(state)

  return (
    <section className="saved-data-notice" aria-labelledby="legacy-origin-notice-title">
      <div className="saved-data-notice-text">
        <h2 id="legacy-origin-notice-title">CVForge has moved to {newHost}</h2>
        <p>
          Your CV is saved in this browser for this address only, so it will not appear at the
          new address by itself. Download a JSON backup here, then choose Import in the Builder
          at {newHost}. This address stays available while you move your CV.
        </p>
      </div>
      <div className="saved-data-notice-actions">
        {canExport && (
          <button type="button" className="btn sm" onClick={() => exportCVState(state)}>
            Download JSON backup
          </button>
        )}
        <a className="btn sm" href={`${siteConfig.url}/builder`}>
          Open {newHost}
        </a>
      </div>
    </section>
  )
}
