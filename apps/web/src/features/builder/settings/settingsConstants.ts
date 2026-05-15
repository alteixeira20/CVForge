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

export const FONT_FAMILY_OPTIONS: { label: string; value: string }[] = [
  { label: 'Lexend', value: 'Lexend' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
]
