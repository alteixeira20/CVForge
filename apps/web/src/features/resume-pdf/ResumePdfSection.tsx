import { Text, View } from '@react-pdf/renderer'
import { type ReactNode } from 'react'
import { cleanList, cleanText } from '@/features/resume-formatting'
import { type PdfStyles } from './types'

interface ResumePdfSectionProps {
  title: string
  styles: PdfStyles
  children: ReactNode
}

export function ResumePdfSection({ title, styles, children }: ResumePdfSectionProps) {
  const heading = cleanText(title) || 'Section'

  return (
    <View style={styles.section} minPresenceAhead={36}>
      <View style={styles.sectionHeader} wrap={false}>
        <View style={styles.sectionTick} />
        <Text style={styles.sectionTitleText}>{heading}</Text>
        <View style={styles.sectionRule} />
      </View>
      {children}
    </View>
  )
}

export function ResumePdfBullets({ bullets, styles, visible = true }: { bullets: string[]; styles: PdfStyles; visible?: boolean }) {
  if (!visible) return null
  const visibleBullets = cleanList(bullets)

  if (visibleBullets.length === 0) return null

  return (
    <View style={styles.bulletList}>
      {visibleBullets.map((bullet) => (
        <View key={bullet} style={styles.bulletRow}>
          <View style={styles.bulletMarker} />
          <Text style={styles.bulletText} wrap>{bullet}</Text>
        </View>
      ))}
    </View>
  )
}

export function ResumePdfParagraph({ bullets, styles, visible = true }: { bullets: string[]; styles: PdfStyles; visible?: boolean }) {
  if (!visible) return null
  const lines = cleanList(bullets)
  if (lines.length === 0) return null

  const text = lines
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
    .join(' ')

  if (!text) return null
  return <Text style={styles.paragraph} wrap>{text}</Text>
}
