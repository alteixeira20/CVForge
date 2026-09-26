import { describe, expect, it } from 'vitest'
import { FONT_FAMILY_OPTIONS } from '@/features/builder/settings/settingsConstants'
import { resolvePdfFont } from './resumePdfFontHelpers'

describe('PDF font resolution', () => {
  it('maps every offered option to the family its label names', () => {
    const resolved = FONT_FAMILY_OPTIONS.map((option) => [option.display, resolvePdfFont(option.value)])
    expect(resolved).toEqual([
      ['Helvetica', 'Helvetica'],
      ['Times', 'Times-Roman'],
      ['Courier', 'Courier'],
    ])
  })

  it.each([
    ['Lexend', 'Helvetica'],
    ['Inter', 'Helvetica'],
    ['Helvetica', 'Helvetica'],
    ['Times New Roman', 'Times-Roman'],
    ['Georgia', 'Times-Roman'],
    ['Courier New', 'Courier'],
    ['Courier', 'Courier'],
    ['JetBrains Mono', 'Courier'],
    ['sans-serif', 'Helvetica'],
    ['serif', 'Times-Roman'],
    ['', 'Helvetica'],
  ])('maps the stored value %j to %s', (stored, expected) => {
    expect(resolvePdfFont(stored)).toBe(expected)
  })
})
