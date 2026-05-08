'use client'

import { useCV } from '@/context/CVContext'
import { TextInput } from '@/components/shared/form/TextInput'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { SettingRow } from '@/components/shared/form/SettingRow'

export function TypographySettings() {
  const { state, updateSettingsField } = useCV()
  const { fontFamily, fontSize, nameFontSize, sectionHeadingSize, lineHeight } = state.settings

  return (
    <div className="space-y-4">
      <SettingRow label="Font Family">
        <TextInput
          value={fontFamily}
          onChange={(e) => updateSettingsField('fontFamily', e.target.value)}
        />
      </SettingRow>

      <SettingRow label="Base Size">
        <NumberInput
          value={fontSize}
          onChange={(val) => updateSettingsField('fontSize', val)}
          min={8}
          max={14}
        />
      </SettingRow>

      <SettingRow label="Name Size">
        <NumberInput
          value={nameFontSize}
          onChange={(val) => updateSettingsField('nameFontSize', val)}
          min={14}
          max={32}
        />
      </SettingRow>

      <SettingRow label="Heading Size">
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
