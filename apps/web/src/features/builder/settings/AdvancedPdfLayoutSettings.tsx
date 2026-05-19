'use client'

import { useCV } from '@/context/CVContext'
import { NumberInput } from '@/components/shared/form/NumberInput'
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
  const {
    topBarHeight,
    contactGap,
    summaryGap,
    titleMetaGap,
    descriptionGap,
    workEntryGap,
    educationEntryGap,
    projectEntryGap,
    languageLineHeight,
  } = state.settings

  return (
    <div className="py-2 space-y-4">
      <div>
        <GroupLabel>Header</GroupLabel>
        <div className="grid grid-cols-3 gap-2">
          <SettingControl label="Top bar" unit="pt">
            <NumberInput
              value={topBarHeight}
              onChange={(val) => updateSettingsField('topBarHeight', val)}
              min={0}
              max={16}
              step={0.5}
            />
          </SettingControl>
          <SettingControl label="Contact gap" unit="pt">
            <NumberInput
              value={contactGap}
              onChange={(val) => updateSettingsField('contactGap', val)}
              min={0}
              max={24}
              step={0.5}
            />
          </SettingControl>
          <SettingControl label="Summary gap" unit="pt">
            <NumberInput
              value={summaryGap}
              onChange={(val) => updateSettingsField('summaryGap', val)}
              min={0}
              max={20}
              step={0.5}
            />
          </SettingControl>
        </div>
      </div>

      <div>
        <GroupLabel>Entry rhythm</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          <SettingControl label="Title/meta gap" unit="pt">
            <NumberInput
              value={titleMetaGap}
              onChange={(val) => updateSettingsField('titleMetaGap', val)}
              min={0}
              max={10}
              step={0.5}
            />
          </SettingControl>
          <SettingControl label="Desc. gap" unit="pt">
            <NumberInput
              value={descriptionGap}
              onChange={(val) => updateSettingsField('descriptionGap', val)}
              min={0}
              max={12}
              step={0.5}
            />
          </SettingControl>
        </div>
      </div>

      <div>
        <GroupLabel>Per-section entry gap</GroupLabel>
        <div className="grid grid-cols-3 gap-2">
          <SettingControl label="Work" unit="pt">
            <NumberInput
              value={workEntryGap}
              onChange={(val) => updateSettingsField('workEntryGap', val)}
              min={0}
              max={24}
              step={0.5}
            />
          </SettingControl>
          <SettingControl label="Education" unit="pt">
            <NumberInput
              value={educationEntryGap}
              onChange={(val) => updateSettingsField('educationEntryGap', val)}
              min={0}
              max={24}
              step={0.5}
            />
          </SettingControl>
          <SettingControl label="Projects" unit="pt">
            <NumberInput
              value={projectEntryGap}
              onChange={(val) => updateSettingsField('projectEntryGap', val)}
              min={0}
              max={24}
              step={0.5}
            />
          </SettingControl>
        </div>
      </div>

      <div>
        <GroupLabel>Languages</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          <SettingControl label="Line height" unit="ratio">
            <NumberInput
              value={languageLineHeight}
              onChange={(val) => updateSettingsField('languageLineHeight', val)}
              min={1}
              max={2}
              step={0.05}
            />
          </SettingControl>
        </div>
      </div>
    </div>
  )
}
