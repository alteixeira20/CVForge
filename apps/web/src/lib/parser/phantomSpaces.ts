// Older CVForge exports (react-pdf) wrote a real space glyph at each
// hyphenation point and then moved the next glyph back by most of a space's
// width. On paper the word looks joined, but every text extractor, including
// ATS software, reads "progra mming". This module finds those phantom spaces in
// the raw glyph runs and removes them from the extracted text.

type GlyphRunItem = { unicode?: string, width?: number } | number | null | undefined

export interface PhantomJoin {
  left: string
  right: string
}

// Helvetica's space is 278 units wide; the phantom spaces are pulled back by
// about 248. A genuine space keeps most of its width.
const DEFAULT_SPACE_WIDTH = 278
const PHANTOM_PULL_BACK_RATIO = 0.6

export function isReactPdfProducer(info: unknown) {
  if (!info || typeof info !== 'object') return false
  const { Creator, Producer } = info as { Creator?: unknown, Producer?: unknown }
  return /react-pdf/i.test(String(Creator ?? '')) || /react-pdf|cvforge/i.test(String(Producer ?? ''))
}

export function findPhantomJoins(runs: GlyphRunItem[][]): PhantomJoin[] {
  const joins: PhantomJoin[] = []
  for (const run of runs) {
    run.forEach((item, index) => {
      if (!isPhantomSpace(item, run[index + 1])) return
      const left = fragment(run, index - 1, -1)
      const right = fragment(run, index + 2, 1)
      if (left && right) joins.push({ left, right })
    })
  }
  return joins
}

function isPhantomSpace(item: GlyphRunItem, next: GlyphRunItem) {
  if (!isGlyph(item) || item.unicode !== ' ' || typeof next !== 'number') return false
  const width = item.width && item.width > 0 ? item.width : DEFAULT_SPACE_WIDTH
  return next >= width * PHANTOM_PULL_BACK_RATIO
}

// Collects glyph text from `start` in `step` direction until a space glyph,
// skipping spacing numbers.
function fragment(run: GlyphRunItem[], start: number, step: 1 | -1) {
  const characters: string[] = []
  for (let index = start; index >= 0 && index < run.length; index += step) {
    const item = run[index]
    if (!isGlyph(item)) continue
    if (!item.unicode || item.unicode === ' ') break
    characters.push(item.unicode)
  }
  return step === 1 ? characters.join('') : characters.reverse().join('')
}

function isGlyph(item: GlyphRunItem): item is { unicode?: string, width?: number } {
  return Boolean(item) && typeof item === 'object'
}

// Applies joins in document order: "left <whitespace> right" becomes
// "leftright". A join that cannot be found is skipped.
export function repairPhantomSpaces(text: string, joins: PhantomJoin[]) {
  let repaired = text
  let cursor = 0
  for (const { left, right } of joins) {
    const pattern = new RegExp(`${escapeRegExp(left)}\\s+${escapeRegExp(right)}`, 'g')
    pattern.lastIndex = cursor
    const match = pattern.exec(repaired)
    if (!match) continue
    const joined = `${left}${right}`
    repaired = repaired.slice(0, match.index) + joined + repaired.slice(match.index + match[0].length)
    cursor = match.index + left.length
  }
  return repaired
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
