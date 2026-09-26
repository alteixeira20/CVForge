import { describe, expect, it } from 'vitest'
import { defaultCVState, type CVState } from '@/types/cv'
import { findUnsupportedPdfCharacters, unsupportedCharactersInCV } from './pdfCharacterSupport'

describe('PDF character support', () => {
  it('accepts ASCII, Western European letters, and typographic punctuation', () => {
    const text = 'Zoë Brontë, café, naïve, Ångström, Straße, “quotes”, • bullet, …, €, ™'
    expect(findUnsupportedPdfCharacters(text)).toEqual([])
  })

  it.each([
    ['Polish', 'Łukasz Żółć', ['Ł', 'Ż', 'ł', 'ć']],
    ['Greek', 'Αθήνα', ['Α', 'θ', 'ή', 'ν', 'α']],
    ['Cyrillic', 'Мос', ['М', 'о', 'с']],
    ['CJK', '東京', ['東', '京']],
    ['emoji', 'Launched \u{1F680}', ['\u{1F680}']],
  ])('reports %s characters once each', (_, text, expected) => {
    expect(findUnsupportedPdfCharacters(text)).toEqual(expected)
  })

  it('checks only text that appears in the PDF', () => {
    const state = JSON.parse(JSON.stringify(defaultCVState)) as CVState
    state.resume.profile.name = 'Alex М'
    expect(unsupportedCharactersInCV(state)).toEqual(['М'])
    state.resume.profile.name = 'Alex'
    state.resume.projects = [{ id: 'p', name: '東', link: '', startDate: '', endDate: '', bullets: [] }]
    state.settings.visibleSections.projects = false
    expect(unsupportedCharactersInCV(state)).toEqual([])
  })
})
