export const SECTION_LABELS: Record<string, string> = {
  workExperience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  customSections: 'Custom Sections',
}

// Only the PDF core fonts are offered, because the exported PDF does not
// embed font files. Each option is exactly the family the PDF uses.
export const FONT_FAMILY_OPTIONS = [
  { value: 'Helvetica', display: 'Helvetica', category: 'Sans' },
  { value: 'Times New Roman', display: 'Times', category: 'Serif' },
  { value: 'Courier New', display: 'Courier', category: 'Mono' },
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
