import { type CVState } from '@/types/cv'
import { normalizedVisibleText } from '@/features/scoring/visibleText'

// Characters outside Windows-1252 (WinAnsi) Latin-1 that the standard PDF
// fonts can still encode. Listed as code points to keep this file ASCII.
const WIN_ANSI_EXTRAS = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030,
  0x0160, 0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022,
  0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
])

const MAX_REPORTED_CHARACTERS = 12

export function isPdfEncodable(character: string): boolean {
  const codePoint = character.codePointAt(0) ?? 0
  if (codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d) return true
  if (codePoint >= 0x20 && codePoint <= 0x7e) return true
  if (codePoint >= 0xa0 && codePoint <= 0xff) return true
  return WIN_ANSI_EXTRAS.has(codePoint)
}

// Unique characters, in order of first appearance, that the exported PDF
// cannot show with its standard fonts.
export function findUnsupportedPdfCharacters(text: string): string[] {
  const found = new Set<string>()
  for (const character of text) {
    if (!isPdfEncodable(character)) found.add(character)
    if (found.size >= MAX_REPORTED_CHARACTERS) break
  }
  return Array.from(found)
}

export function unsupportedCharactersInCV(state: CVState): string[] {
  return findUnsupportedPdfCharacters(normalizedVisibleText(state))
}
