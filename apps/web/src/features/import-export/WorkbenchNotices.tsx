'use client'

import { LegacyOriginNotice } from './LegacyOriginNotice'
import { SavedDataNotice } from './SavedDataNotice'

export function WorkbenchNotices() {
  return (
    <>
      <LegacyOriginNotice />
      <SavedDataNotice />
    </>
  )
}
