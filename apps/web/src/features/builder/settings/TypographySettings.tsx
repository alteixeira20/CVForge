'use client'

import { useCV } from '@/context/CVContext'
import { NumberInput } from '@/components/shared/form/NumberInput'
import {
  lineHeightToLineSpacing,
  lineSpacingToLineHeight,
} from '@/features/resume-pdf/resumePdfLayoutHelpers'
import { SettingControl } from './SettingControl'

export function TypographySettings() {
  const { state, updateSettingsField } = useCV()
  const { fontSize, nameFontSize, sectionHeadingSize, lineHeight } = state.settings

  const lineSpacingDisplay = lineHeightToLineSpacing(lineHeight)

  return (
    <div className="py-2 space-y-2">
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

        <SettingControl label="Line Spacing">
          <NumberInput
            aria-label="Line Spacing (0 = tight)"
            title="0 = tight, 0.5 = default, 1 = loose"
            value={lineSpacingDisplay}
            onChange={(val) => updateSettingsField('lineHeight', lineSpacingToLineHeight(val))}
            step={0.05}
            min={0}
            max={1}
          />
        </SettingControl>
      </div>
    </div>
  )
}
