import { Text, View } from '@react-pdf/renderer'
import { type PdfStyles } from './types'

interface ResumePdfEntryProps {
  title?: string
  subtitle?: string
  dates?: string
  styles: PdfStyles
}

export function ResumePdfEntry({ title, subtitle, dates, styles }: ResumePdfEntryProps) {
  if (!title && !subtitle && !dates) return null

  return (
    <View style={styles.entry} wrap={false}>
      {(title || dates) && (
        <View style={styles.row}>
          {title ? <Text style={styles.title}>{title}</Text> : <Text />}
        {dates && <Text style={styles.muted}>{dates}</Text>}
        </View>
      )}
      {subtitle && <Text style={styles.muted}>{subtitle}</Text>}
    </View>
  )
}
