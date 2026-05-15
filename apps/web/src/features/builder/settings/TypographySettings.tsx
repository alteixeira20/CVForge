'use client'

import { useCV } from '@/context/CVContext'
import { SelectInput } from '@/components/shared/form/SelectInput'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { SettingRow } from '@/components/shared/form/SettingRow'
import { FONT_FAMILY_OPTIONS } from './settingsConstants'

export function TypographySettings() {
  const { state, updateSettingsField } = useCV()
  const { fontFamily, fontSize, nameFontSize, sectionHeadingSize, lineHeight } = state.settings

  return (
    <div className="divide-y divide-border-faint/50">
      <SettingRow label="Font Family">
        <SelectInput
          value={fontFamily}
          options={FONT_FAMILY_OPTIONS}
          onChange={(e) => updateSettingsField('fontFamily', e.target.value)}
        />
      </SettingRow>

      <SettingRow label="Base Size" description="pt">
        <NumberInput
          value={fontSize}
          onChange={(val) => updateSettingsField('fontSize', val)}
          min={8}
          max={14}
        />
      </SettingRow>

      <SettingRow label="Name Size" description="pt">
        <NumberInput
          value={nameFontSize}
          onChange={(val) => updateSettingsField('nameFontSize', val)}
          min={14}
          max={32}
        />
      </SettingRow>

      <SettingRow label="Heading Size" description="pt">
        <NumberInput
          value={sectionHeadingSize}
          onChange={(val) => updateSettingsField('sectionHeadingSize', val)}
          min={10}
          max={18}
        />
      </SettingRow>

      <SettingRow label="Line Height">
        <NumberInput
          value={lineHeight}
          onChange={(val) => updateSettingsField('lineHeight', val)}
          step={0.1}
          min={1}
          max={2}
        />
      </SettingRow>
    </div>
  )
}
