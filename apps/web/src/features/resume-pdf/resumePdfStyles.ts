import { StyleSheet } from '@react-pdf/renderer'
import { type Settings } from '@/types/cv'

export function createResumePdfStyles(settings: Settings) {
  const fontFamily = resolvePdfFont(settings.fontFamily)

  return StyleSheet.create({
    page: {
      padding: 42,
      fontFamily,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      color: '#1a1a1a',
    },
    name: { fontSize: settings.nameFontSize, fontWeight: 700, color: settings.themeColor },
    muted: { color: '#555' },
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
    title: { fontWeight: 700 },
    bullet: { marginTop: 3 },
  })
}

function resolvePdfFont(fontFamily: string) {
  if (fontFamily.toLowerCase().includes('mono')) return 'Courier'
  if (fontFamily.toLowerCase().includes('serif')) return 'Times-Roman'
  return 'Helvetica'
}
