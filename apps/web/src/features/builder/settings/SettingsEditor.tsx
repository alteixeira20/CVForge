'use client'

import { DocumentSettings } from './DocumentSettings'
import { TypographySettings } from './TypographySettings'
import { SpacingSettings } from './SpacingSettings'

export function SettingsEditor() {
  return (
    <div className="space-y-32">
      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-16 font-bold">Document & Color</h4>
        <DocumentSettings />
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-16 font-bold">Typography</h4>
        <TypographySettings />
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-16 font-bold">Spacing (px)</h4>
        <SpacingSettings />
      </section>
    </div>
  )
}
