'use client'

import { DocumentSettings } from './DocumentSettings'
import { TypographySettings } from './TypographySettings'
import { SpacingSettings } from './SpacingSettings'
import { ContentRenderingSettings } from './ContentRenderingSettings'
import { SectionManager } from './SectionManager'
import { AdvancedPdfLayoutSettings } from './AdvancedPdfLayoutSettings'
import { SettingsPanel } from './SettingsPanel'
import { ResetSettingsControl } from './ResetSettingsControl'

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

      <SettingsPanel title="Content">
        <ContentRenderingSettings />
      </SettingsPanel>

      <SettingsPanel title="Sections">
        <SectionManager />
      </SettingsPanel>

      <SettingsPanel title="Advanced PDF Layout">
        <AdvancedPdfLayoutSettings />
      </SettingsPanel>

      <ResetSettingsControl />
    </div>
  )
}
