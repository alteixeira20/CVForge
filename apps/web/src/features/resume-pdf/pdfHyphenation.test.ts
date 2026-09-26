import { describe, expect, it } from 'vitest'
import { hyphenateForPdf } from './pdfHyphenation'

const builtin = (word: string) => (word === 'reliability' ? ['re', 'li', 'a', 'bil', 'i', 'ty'] : [word])

describe('PDF hyphenation', () => {
  it('keeps ordinary words on the built-in hyphenation', () => {
    expect(hyphenateForPdf('reliability', builtin)).toEqual(['re', 'li', 'a', 'bil', 'i', 'ty'])
    expect(hyphenateForPdf('CV', builtin)).toEqual(['CV'])
  })

  it('breaks links after separators instead of inside words', () => {
    const url = 'https://example.org/projects/report?version=complete&section=appendix'
    const parts = hyphenateForPdf(url, builtin)
    expect(parts.join('')).toBe(url)
    expect(parts).toContain('projects/')
    expect(parts.some((part) => part.startsWith('sion'))).toBe(false)
  })

  it.each([
    'https://example.org/' + 'A1b2C3d4E5f6G7h8'.repeat(9),
    'x'.repeat(200),
    'alex.morgan.with.a.very.long.address@example-organization.org',
  ])('never leaves a run longer than 18 characters and keeps the text intact', (token) => {
    const parts = hyphenateForPdf(token, builtin)
    expect(parts.join('')).toBe(token)
    expect(Math.max(...parts.map((part) => part.length))).toBeLessThanOrEqual(18)
  })
})
