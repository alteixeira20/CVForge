'use client'

import { useCV } from '@/context/CVContext'
import { SelectInput } from '@/components/shared/form/SelectInput'
import { SettingRow } from '@/components/shared/form/SettingRow'
import { FieldLabel } from '@/components/shared/form/FieldLabel'
import { ThemeColorPicker } from './ThemeColorPicker'
import { type DocumentSize, type LocalePreset } from '@/types/cv'

export function DocumentSettings() {
  const { state, updateSettingsField } = useCV()
  const { documentSize, localePreset, themeColor } = state.settings

  return (
    <div className="divide-y divide-border-faint/50">
      <div className="py-3 space-y-2">
        <FieldLabel className="mb-0 text-[11px]">Theme Color</FieldLabel>
        <ThemeColorPicker
          value={themeColor}
          onChange={(val) => updateSettingsField('themeColor', val)}
        />
      </div>

      <SettingRow label="Page Size">
        <SelectInput
          value={documentSize}
          options={[
            { label: 'A4 (EU)', value: 'A4' },
            { label: 'Letter (US)', value: 'Letter' },
          ]}
          onChange={(e) => updateSettingsField('documentSize', e.target.value as DocumentSize)}
        />
      </SettingRow>

      <SettingRow label="Locale">
        <SelectInput
          value={localePreset}
          options={[
            { label: 'EU Standard', value: 'EU' },
            { label: 'US Standard', value: 'US' },
          ]}
          onChange={(e) => updateSettingsField('localePreset', e.target.value as LocalePreset)}
        />
      </SettingRow>
    </div>
  )
}
