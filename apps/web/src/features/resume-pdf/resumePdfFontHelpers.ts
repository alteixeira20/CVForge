export function resolveDateFont(_fontFamily: string) {
  return 'Courier'
}

export function resolvePdfFont(fontFamily: string) {
  const font = fontFamily.toLowerCase()

  // Map common font types to core PDF fonts.
  // Note: Lexend and JetBrains Mono are used in the web app but are not yet
  // bundled as local assets for PDF embedding. We fallback to standard PDF fonts.
  if (font.includes('mono')) return 'Courier'
  if (font.includes('serif') || font.includes('times') || font.includes('georgia')) return 'Times-Roman'

  // Default to Helvetica for sans-serif (Lexend, Inter, Roboto, etc.)
  return 'Helvetica'
}
