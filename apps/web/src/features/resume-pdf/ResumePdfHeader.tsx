import { Text, View } from '@react-pdf/renderer'
import { type Profile, type Settings } from '@/types/cv'
import { cleanText } from '@/features/resume-formatting'
import { type PdfStyles } from './types'
import { PAGE_PADDING } from './resumePdfStyles'

interface HeaderProps {
  profile: Profile
  settings: Settings
  styles: PdfStyles
}

function buildContactValues(profile: Profile): string[] {
  return [
    profile.email,
    profile.phone,
    profile.location,
    profile.website,
    profile.github,
    profile.linkedin,
  ]
    .map(cleanText)
    .filter(Boolean)
}

function splitRows(values: string[]): [string[], string[]] {
  if (values.length <= 3) return [values, []]
  const mid = Math.ceil(values.length / 2)
  return [values.slice(0, mid), values.slice(mid)]
}

function rowText(values: string[]): string {
  return values.join('  ·  ')
}

function AccentBar({ color }: { color: string }) {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: color,
        marginLeft: -PAGE_PADDING,
        marginRight: -PAGE_PADDING,
        marginTop: -PAGE_PADDING,
        marginBottom: 14,
      }}
    />
  )
}

function ContactBlock({ values, styles }: { values: string[]; styles: PdfStyles }) {
  const [row1, row2] = splitRows(values)
  return (
    <View style={{ marginTop: 5 }}>
      <Text style={styles.contact}>{rowText(row1)}</Text>
      {row2.length > 0 && <Text style={styles.contactNext}>{rowText(row2)}</Text>}
    </View>
  )
}

export function ResumePdfHeader({ profile, settings, styles }: HeaderProps) {
  const name = cleanText(profile.name)
  const summary = cleanText(profile.summary)
  const contactValues = buildContactValues(profile)

  if (!name && contactValues.length === 0 && !summary) return null

  return (
    <View>
      <AccentBar color={settings.themeColor} />
      {name && <Text style={styles.name}>{name}</Text>}
      {contactValues.length > 0 && <ContactBlock values={contactValues} styles={styles} />}
      {summary && (
        <View style={{ marginTop: settings.profileSpacing }}>
          <Text style={styles.summary}>{summary}</Text>
        </View>
      )}
    </View>
  )
}
