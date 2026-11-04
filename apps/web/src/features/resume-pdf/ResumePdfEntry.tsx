import { Link, Text, View } from '@react-pdf/renderer'
import { cleanText } from '@/lib/resume-formatting'
import { type PdfStyles } from './types'
import { resolveEntryLink } from './resolveEntryLink'

interface ResumePdfEntryProps {
  title?: string
  titleLink?: string
  organization?: string
  subtitle?: string
  dates?: string
  styles: PdfStyles
}

export function ResumePdfEntry({ title, titleLink, organization, subtitle, dates, styles }: ResumePdfEntryProps) {
  const cleanTitle = cleanText(title)
  const cleanOrganization = cleanText(organization)
  const cleanSubtitle = cleanText(subtitle)
  const cleanDates = cleanText(dates)

  if (!cleanTitle && !cleanOrganization && !cleanSubtitle && !cleanDates) return null

  const resolvedLink = resolveEntryLink(titleLink)

  return (
    <View style={styles.entry} wrap={false}>
      {(cleanTitle || cleanOrganization || cleanDates) && (
        <View style={styles.entryRow}>
          <EntryTitle
            title={cleanTitle}
            titleLink={resolvedLink}
            organization={cleanOrganization}
            styles={styles}
          />
          {cleanDates && <Text style={styles.entryDates}>{cleanDates}</Text>}
        </View>
      )}
      {cleanSubtitle && <Subtitle text={cleanSubtitle} styles={styles} />}
    </View>
  )
}

interface EntryTitleProps {
  title: string
  titleLink: string | null
  organization: string
  styles: PdfStyles
}

function EntryTitle({ title, titleLink, organization, styles }: EntryTitleProps) {
  if (!title && !organization) return <Text />

  const separator = title && organization ? <Text style={styles.entryOrg}> · </Text> : null
  const orgNode = organization ? <Text style={styles.entryOrg}>{organization}</Text> : null

  if (titleLink && title) {
    return (
      <Text style={styles.entryTitle}>
        <Link src={titleLink} style={styles.entryTitleLink}>
          {title}
        </Link>
        {separator}
        {orgNode}
      </Text>
    )
  }

  return (
    <Text style={styles.entryTitle}>
      {title}
      {separator}
      {orgNode}
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
