'use client'

import { useCV } from '@/context/CVContext'
import { NumberInput } from '@/components/shared/form/NumberInput'
import { advancedLayoutControlGroups } from './advancedLayoutControls'
import { SettingControl } from './SettingControl'

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-4 mb-1.5">
      {children}
    </p>
  )
}

export function AdvancedPdfLayoutSettings() {
  const { state, updateSettingsField } = useCV()

  return (
    <div className="py-2 space-y-4">
      {advancedLayoutControlGroups.map((group) => (
        <div key={group.label}>
          <GroupLabel>{group.label}</GroupLabel>
          <div className={group.gridClassName}>
            {group.controls.map((control) => (
              <SettingControl key={control.key} label={control.label} unit={control.unit}>
                <NumberInput
                  value={state.settings[control.key]}
                  onChange={(val) => updateSettingsField(control.key, val)}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                />
              </SettingControl>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
