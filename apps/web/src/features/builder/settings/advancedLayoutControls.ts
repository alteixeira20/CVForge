import type { Settings } from '@/types/cv'

export type AdvancedLayoutSettingKey = keyof Pick<
  Settings,
  | 'topBarHeight'
  | 'contactGap'
  | 'summaryGap'
  | 'titleMetaGap'
  | 'descriptionGap'
  | 'workEntryGap'
  | 'educationEntryGap'
  | 'projectEntryGap'
  | 'languageLineHeight'
>

export interface AdvancedLayoutControl {
  key: AdvancedLayoutSettingKey
  label: string
  unit: string
  min: number
  max: number
  step: number
}

export interface AdvancedLayoutControlGroup {
  label: string
  gridClassName: string
  controls: readonly AdvancedLayoutControl[]
}

export const advancedLayoutControlGroups: readonly AdvancedLayoutControlGroup[] = [
  {
    label: 'Header',
    gridClassName: 'grid grid-cols-3 gap-2',
    controls: [
      { key: 'topBarHeight', label: 'Top bar', unit: 'pt', min: 0, max: 16, step: 0.5 },
      { key: 'contactGap', label: 'Contact gap', unit: 'pt', min: 0, max: 24, step: 0.5 },
      { key: 'summaryGap', label: 'Summary gap', unit: 'pt', min: 0, max: 20, step: 0.5 },
    ],
  },
  {
    label: 'Entry rhythm',
    gridClassName: 'grid grid-cols-2 gap-2',
    controls: [
      {
        key: 'titleMetaGap',
        label: 'Title/meta gap',
        unit: 'pt',
        min: 0,
        max: 10,
        step: 0.5,
      },
      { key: 'descriptionGap', label: 'Desc. gap', unit: 'pt', min: 0, max: 12, step: 0.5 },
    ],
  },
  {
    label: 'Per-section entry gap',
    gridClassName: 'grid grid-cols-3 gap-2',
    controls: [
      { key: 'workEntryGap', label: 'Work', unit: 'pt', min: 0, max: 24, step: 0.5 },
      {
        key: 'educationEntryGap',
        label: 'Education',
        unit: 'pt',
        min: 0,
        max: 24,
        step: 0.5,
      },
      { key: 'projectEntryGap', label: 'Projects', unit: 'pt', min: 0, max: 24, step: 0.5 },
    ],
  },
  {
    label: 'Languages',
    gridClassName: 'grid grid-cols-2 gap-2',
    controls: [
      {
        key: 'languageLineHeight',
        label: 'Line height',
        unit: 'ratio',
        min: 1,
        max: 2,
        step: 0.05,
      },
    ],
  },
]
