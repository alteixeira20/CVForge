'use client'

import { DocumentSettings } from './DocumentSettings'
import { TypographySettings } from './TypographySettings'
import { SpacingSettings } from './SpacingSettings'
import { SettingsPanel } from './SettingsPanel'

export function SettingsEditor() {
  return (
    <div className="space-y-4">
      <SettingsPanel title="Appearance">
        <DocumentSettings />
      </SettingsPanel>

      <SettingsPanel title="Typography">
        <TypographySettings />
      </SettingsPanel>

      <SettingsPanel title="Spacing">
        <SpacingSettings />
      </SettingsPanel>
    </div>
  )
}
