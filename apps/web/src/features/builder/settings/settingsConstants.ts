export const SECTION_LABELS: Record<string, string> = {
  workExperience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  customSections: 'Custom Sections',
}

export const FONT_FAMILY_GROUPS = [
  {
    category: 'Sans',
    fonts: [
      { value: 'Lexend', display: 'Lexend' },
      { value: 'Inter', display: 'Inter' },
      { value: 'Helvetica', display: 'Helvetica' },
    ],
  },
  {
    category: 'Serif',
    fonts: [
      { value: 'Times New Roman', display: 'Times' },
      { value: 'Georgia', display: 'Georgia' },
    ],
  },
  {
    category: 'Mono',
    fonts: [
      { value: 'Courier New', display: 'Courier' },
      { value: 'JetBrains Mono', display: 'JetBrains' },
    ],
  },
] as const

export const THEME_COLORS = [
  '#2c1f19',
  '#111827',
  '#1e3a5f',
  '#2563eb',
  '#166534',
  '#7f1d1d',
  '#92400e',
  '#4b5563',
  '#6d28d9',
  '#0f766e',
] as const

export type ThemeColor = typeof THEME_COLORS[number]
