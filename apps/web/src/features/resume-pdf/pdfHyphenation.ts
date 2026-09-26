type Hyphenate = (word: string) => string[]

// Longest run of characters the PDF layout may keep unbroken. A longer run
// (a URL segment, a hash, a long compound) could otherwise overflow the page.
const MAX_UNBROKEN_LENGTH = 18
const LINK_SEPARATORS = '/?&=#._-'
const LINK_LIKE = /[/@]|:\/\/|^www\./i

// react-pdf passes its built-in English hyphenation as the second argument.
// The stored text is never changed; this only offers extra break points.
export function hyphenateForPdf(word: string, builtin?: Hyphenate): string[] {
  const parts = LINK_LIKE.test(word)
    ? splitAfterSeparators(word)
    : (builtin ? builtin(word) : [word])
  return parts.flatMap(splitLongPart).filter((part) => part.length > 0)
}

function splitAfterSeparators(word: string): string[] {
  const parts: string[] = []
  let current = ''
  for (const character of word) {
    current += character
    if (LINK_SEPARATORS.includes(character)) {
      parts.push(current)
      current = ''
    }
  }
  if (current) parts.push(current)
  return parts
}

function splitLongPart(part: string): string[] {
  if (part.length <= MAX_UNBROKEN_LENGTH) return [part]
  const pieces: string[] = []
  for (let start = 0; start < part.length; start += MAX_UNBROKEN_LENGTH) {
    pieces.push(part.slice(start, start + MAX_UNBROKEN_LENGTH))
  }
  return pieces
}
