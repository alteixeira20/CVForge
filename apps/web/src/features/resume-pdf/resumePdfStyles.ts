import { StyleSheet } from '@react-pdf/renderer'
import { type Settings } from '@/types/cv'

export const PAGE_PADDING = 42

export function createResumePdfStyles(settings: Settings) {
  const fontFamily = resolvePdfFont(settings.fontFamily)
  const contactSize = Math.max(settings.fontSize - 1, 8)

  return StyleSheet.create({
    page: {
      padding: PAGE_PADDING,
      fontFamily,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      color: '#1a1a1a',
    },
    name: { fontSize: settings.nameFontSize, fontWeight: 700, color: settings.themeColor },
    muted: { color: '#555' },
    contact: { fontSize: contactSize, color: '#555', lineHeight: 1.4 },
    contactNext: { fontSize: contactSize, color: '#555', lineHeight: 1.4, marginTop: 2 },
    summary: {
      fontSize: settings.fontSize,
      color: '#333',
      lineHeight: settings.lineHeight,
      textAlign: 'justify',
    },
    section: { marginTop: settings.sectionSpacing },
    sectionTitle: {
      fontSize: settings.sectionHeadingSize,
      color: settings.themeColor,
      fontWeight: 700,
      borderBottomWidth: 1,
      borderBottomColor: settings.themeColor,
      paddingBottom: 3,
      marginBottom: 7,
    },
    entry: { marginTop: settings.entrySpacing },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    title: { fontWeight: 700, flexGrow: 1, flexShrink: 1 },
    bullet: { marginTop: 3 },
    paragraph: { marginTop: 3 },
  })
}

function resolvePdfFont(fontFamily: string) {
  const font = fontFamily.toLowerCase()

  // Map common font types to core PDF fonts.
  // Note: Lexend and JetBrains Mono are used in the web app but are not yet
  // bundled as local assets for PDF embedding. We fallback to standard PDF fonts.
  if (font.includes('mono')) return 'Courier'
  if (font.includes('serif') || font.includes('times') || font.includes('georgia')) return 'Times-Roman'
  
  // Default to Helvetica for sans-serif (Lexend, Inter, Roboto, etc.)
  return 'Helvetica'
}
