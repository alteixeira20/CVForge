'use client'

import { useCV } from '@/context/CVContext'
import { SelectInput } from '@/components/shared/form/SelectInput'
import { FieldLabel } from '@/components/shared/form/FieldLabel'
import { ThemeColorPicker } from './ThemeColorPicker'
import { SettingControl } from './SettingControl'
import { type DocumentSize, type LocalePreset } from '@/types/cv'

export function DocumentSettings() {
  const { state, updateSettingsField } = useCV()
  const { documentSize, localePreset, themeColor } = state.settings

  return (
    <div className="py-2 space-y-2">
      <div>
        <FieldLabel className="mb-1 text-[11px]">Theme Color</FieldLabel>
        <ThemeColorPicker
          value={themeColor}
          onChange={(val) => updateSettingsField('themeColor', val)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SettingControl label="Page Size">
          <SelectInput
            value={documentSize}
            options={[
              { label: 'A4 (EU)', value: 'A4' },
              { label: 'Letter (US)', value: 'Letter' },
            ]}
            onChange={(e) => updateSettingsField('documentSize', e.target.value as DocumentSize)}
          />
        </SettingControl>

        <SettingControl label="Locale">
          <SelectInput
            value={localePreset}
            options={[
              { label: 'EU Standard', value: 'EU' },
              { label: 'US Standard', value: 'US' },
            ]}
            onChange={(e) => updateSettingsField('localePreset', e.target.value as LocalePreset)}
          />
        </SettingControl>
      </div>
    </div>
  )
}
