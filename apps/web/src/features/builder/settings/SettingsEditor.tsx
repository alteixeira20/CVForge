'use client'

import { DocumentSettings } from './DocumentSettings'
import { TypographySettings } from './TypographySettings'
import { SpacingSettings } from './SpacingSettings'
import { SectionManager } from './SectionManager'

export function SettingsEditor() {
  return (
    <div className="space-y-10">
      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-4 font-bold">Section Order & Visibility</h4>
        <SectionManager />
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-4 font-bold">Document & Color</h4>
        <DocumentSettings />
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-4 font-bold">Typography</h4>
        <TypographySettings />
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-ink-4 mb-4 font-bold">Spacing (px)</h4>
        <SpacingSettings />
      </section>
    </div>
  )
}
