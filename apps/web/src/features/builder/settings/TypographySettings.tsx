'use client'

import { useCV } from '@/context/CVContext'
import { SelectInput } from '@/components/shared/form/SelectInput'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { SettingControl } from './SettingControl'
import { FONT_FAMILY_OPTIONS } from './settingsConstants'

export function TypographySettings() {
  const { state, updateSettingsField } = useCV()
  const { fontFamily, fontSize, nameFontSize, sectionHeadingSize, lineHeight } = state.settings

  return (
    <div className="py-2 space-y-2">
      <SettingControl label="Font Family">
        <SelectInput
          value={fontFamily}
          options={FONT_FAMILY_OPTIONS}
          onChange={(e) => updateSettingsField('fontFamily', e.target.value)}
        />
      </SettingControl>

      <div className="grid grid-cols-2 gap-2">
        <SettingControl label="Base Size" unit="pt">
          <NumberInput
            value={fontSize}
            onChange={(val) => updateSettingsField('fontSize', val)}
            min={8}
            max={14}
          />
        </SettingControl>

        <SettingControl label="Name Size" unit="pt">
          <NumberInput
            value={nameFontSize}
            onChange={(val) => updateSettingsField('nameFontSize', val)}
            min={14}
            max={32}
          />
        </SettingControl>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SettingControl label="Heading" unit="pt">
          <NumberInput
            value={sectionHeadingSize}
            onChange={(val) => updateSettingsField('sectionHeadingSize', val)}
            min={10}
            max={18}
          />
        </SettingControl>

        <SettingControl label="Line Height">
          <NumberInput
            value={lineHeight}
            onChange={(val) => updateSettingsField('lineHeight', val)}
            step={0.1}
            min={1}
            max={2}
          />
        </SettingControl>
      </div>
    </div>
  )
}
