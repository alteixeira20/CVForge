'use client'

import { useCV } from '@/context/CVContext'
import { SelectInput } from '@/components/shared/form/SelectInput'
import { SettingRow } from '@/components/shared/form/SettingRow'
import { ColorInput } from '@/components/shared/form/ColorInput'
import { type DocumentSize, type LocalePreset } from '@/types/cv'

export function DocumentSettings() {
  const { state, updateSettingsField } = useCV()
  const { documentSize, localePreset, themeColor } = state.settings

  return (
    <div className="space-y-4">
      <SettingRow label="Page Size" description="Physical dimensions">
        <SelectInput
          value={documentSize}
          options={[
            { label: 'A4 (EU)', value: 'A4' },
            { label: 'Letter (US)', value: 'Letter' },
          ]}
          onChange={(e) => updateSettingsField('documentSize', e.target.value as DocumentSize)}
        />
      </SettingRow>

      <SettingRow label="Locale" description="Date & label formats">
        <SelectInput
          value={localePreset}
          options={[
            { label: 'EU Standard', value: 'EU' },
            { label: 'US Standard', value: 'US' },
          ]}
          onChange={(e) => updateSettingsField('localePreset', e.target.value as LocalePreset)}
        />
      </SettingRow>

      <SettingRow label="Theme Color" description="Accent color">
        <ColorInput
          value={themeColor}
          onChange={(val) => updateSettingsField('themeColor', val)}
        />
      </SettingRow>
    </div>
  )
}
