export function resolveDateFont(_fontFamily: string) {
  return 'Courier'
}

export type PdfCoreFont = 'Helvetica' | 'Times-Roman' | 'Courier'

// The PDF uses the three standard core fonts only (no embedded font files).
// Any stored name, including legacy picker values, maps to one of them.
export function resolvePdfFont(fontFamily: string): PdfCoreFont {
  const font = fontFamily.toLowerCase()

  if (font.includes('mono') || font.includes('courier')) return 'Courier'
  if (font.includes('sans')) return 'Helvetica'
  if (font.includes('serif') || font.includes('times') || font.includes('georgia')) return 'Times-Roman'
  return 'Helvetica'
}
