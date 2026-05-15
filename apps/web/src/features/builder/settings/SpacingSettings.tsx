'use client'

import { useCV } from '@/context/CVContext'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { SettingRow } from '@/components/shared/form/SettingRow'

export function SpacingSettings() {
  const { state, updateSettingsField } = useCV()
  const { sectionSpacing, profileSpacing, entrySpacing } = state.settings

  return (
    <div className="divide-y divide-border-faint/50">
      <SettingRow label="Section Gap" description="px">
        <NumberInput
          value={sectionSpacing}
          onChange={(val) => updateSettingsField('sectionSpacing', val)}
          min={0}
          max={50}
        />
      </SettingRow>

      <SettingRow label="Profile Gap" description="px">
        <NumberInput
          value={profileSpacing}
          onChange={(val) => updateSettingsField('profileSpacing', val)}
          min={0}
          max={40}
        />
      </SettingRow>

      <SettingRow label="Entry Gap" description="px">
        <NumberInput
          value={entrySpacing}
          onChange={(val) => updateSettingsField('entrySpacing', val)}
          min={0}
          max={30}
        />
      </SettingRow>
    </div>
  )
}
