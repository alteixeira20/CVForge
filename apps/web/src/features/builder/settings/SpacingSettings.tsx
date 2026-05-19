'use client'

import { useCV } from '@/context/CVContext'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { SettingControl } from './SettingControl'

export function SpacingSettings() {
  const { state, updateSettingsField } = useCV()
  const { sectionSpacing, profileSpacing } = state.settings

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 gap-2">
        <SettingControl label="Section" unit="px">
          <NumberInput
            value={sectionSpacing}
            onChange={(val) => updateSettingsField('sectionSpacing', val)}
            min={0}
            max={50}
          />
        </SettingControl>

        <SettingControl label="Profile" unit="px">
          <NumberInput
            value={profileSpacing}
            onChange={(val) => updateSettingsField('profileSpacing', val)}
            min={0}
            max={40}
          />
        </SettingControl>
      </div>
    </div>
  )
}
