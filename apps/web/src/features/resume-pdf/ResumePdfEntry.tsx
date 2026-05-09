import { Text, View } from '@react-pdf/renderer'
import { type PdfStyles } from './types'

interface ResumePdfEntryProps {
  title: string
  subtitle?: string
  dates?: string
  styles: PdfStyles
}

export function ResumePdfEntry({ title, subtitle, dates, styles }: ResumePdfEntryProps) {
  return (
    <View style={styles.entry}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {dates && <Text style={styles.muted}>{dates}</Text>}
      </View>
      {subtitle && <Text style={styles.muted}>{subtitle}</Text>}
    </View>
  )
}
