import { Text, View } from '@react-pdf/renderer'
import { type ReactNode } from 'react'
import { type PdfStyles } from './types'

interface ResumePdfSectionProps {
  title: string
  styles: PdfStyles
  children: ReactNode
}

export function ResumePdfSection({ title, styles, children }: ResumePdfSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

export function ResumePdfBullets({ bullets, styles, visible = true }: { bullets: string[]; styles: PdfStyles; visible?: boolean }) {
  if (!visible) return null
  const visibleBullets = bullets.filter((bullet) => bullet.trim())

  return (
    <View>
      {visibleBullets.map((bullet) => (
        <Text key={bullet} style={styles.bullet}>- {bullet}</Text>
      ))}
    </View>
  )
}
