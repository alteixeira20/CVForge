import { Link, Text, View } from '@react-pdf/renderer'
import { cleanText } from '@/features/resume-formatting'
import { type PdfStyles } from './types'

interface ResumePdfEntryProps {
  title?: string
  organization?: string
  subtitle?: string
  dates?: string
  styles: PdfStyles
}

export function ResumePdfEntry({ title, organization, subtitle, dates, styles }: ResumePdfEntryProps) {
  const cleanTitle = cleanText(title)
  const cleanOrganization = cleanText(organization)
  const cleanSubtitle = cleanText(subtitle)
  const cleanDates = cleanText(dates)

  if (!cleanTitle && !cleanOrganization && !cleanSubtitle && !cleanDates) return null

  return (
    <View style={styles.entry} wrap={false}>
      {(cleanTitle || cleanOrganization || cleanDates) && (
        <View style={styles.entryRow}>
          <EntryTitle title={cleanTitle} organization={cleanOrganization} styles={styles} />
          {cleanDates && <Text style={styles.entryDates}>{cleanDates}</Text>}
        </View>
      )}
      {cleanSubtitle && <Subtitle text={cleanSubtitle} styles={styles} />}
    </View>
  )
}

function EntryTitle({ title, organization, styles }: { title: string; organization: string; styles: PdfStyles }) {
  if (!title && !organization) return <Text />

  return (
    <Text style={styles.entryTitle}>
      {title}
      {title && organization ? <Text style={styles.entryOrg}> · </Text> : null}
      {organization ? <Text style={styles.entryOrg}>{organization}</Text> : null}
    </Text>
  )
}

function Subtitle({ text, styles }: { text: string; styles: PdfStyles }) {
  if (isUrl(text)) {
    return (
      <Link src={hrefForUrl(text)} style={[styles.entrySubtitle, styles.link]} wrap>
        {text}
      </Link>
    )
  }

  return <Text style={styles.entrySubtitle}>{text}</Text>
}

function isUrl(value: string) {
  return /^(https?:\/\/|www\.|[\w.-]+\.[a-z]{2,})/i.test(value)
}

function hrefForUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}
