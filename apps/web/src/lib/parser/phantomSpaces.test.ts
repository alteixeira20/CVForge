import { describe, expect, it } from 'vitest'
import { findPhantomJoins, isReactPdfProducer, repairPhantomSpaces } from './phantomSpaces'

function glyphs(text: string, width = 500) {
  return [...text].map((unicode) => ({ unicode, width: unicode === ' ' ? 278 : width }))
}

describe('phantom space repair for older CVForge PDFs', () => {
  it('finds a space glyph pulled back by most of its width inside a word', () => {
    const run = [...glyphs('systems progra '), 247.56, ...glyphs('mming curriculum')]
    expect(findPhantomJoins([run])).toEqual([{ left: 'progra', right: 'mming' }])
  })

  it('ignores genuine spaces, small kerning, and a pulled-back second space', () => {
    const kerning = [...glyphs('pr'), 9.77, ...glyphs('ogr'), 19.53, ...glyphs('amming with strict')]
    const doubleSpace = [...glyphs('with  '), 247.56, ...glyphs('strict')]
    expect(findPhantomJoins([kerning, doubleSpace])).toEqual([])
  })

  it('joins fragments across kerning numbers', () => {
    const run = [...glyphs('at 42 P '), 247.56, ...glyphs('or'), -24.41, ...glyphs('to,')]
    expect(findPhantomJoins([run])).toEqual([{ left: 'P', right: 'orto,' }])
  })

  it('repairs the extracted text in order and leaves unmatched text alone', () => {
    const text = 'an intensive systems progra mming curriculum at 42 P orto, Feb 20 23'
    const repaired = repairPhantomSpaces(text, [
      { left: 'progra', right: 'mming' },
      { left: 'P', right: 'orto,' },
      { left: '20', right: '23' },
      { left: 'absent', right: 'pair' },
    ])
    expect(repaired).toBe('an intensive systems programming curriculum at 42 Porto, Feb 2023')
  })

  it('repairs a join split across extracted lines', () => {
    expect(repairPhantomSpaces('developing technical skil\nls.', [{ left: 'skil', right: 'ls.' }]))
      .toBe('developing technical skills.')
  })

  it('only enables the repair for react-pdf or CVForge documents', () => {
    expect(isReactPdfProducer({ Creator: 'react-pdf', Producer: 'CVForge' })).toBe(true)
    expect(isReactPdfProducer({ Producer: 'Microsoft Word' })).toBe(false)
    expect(isReactPdfProducer(undefined)).toBe(false)
  })
})
