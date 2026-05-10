import { Text, View } from '@react-pdf/renderer'
import { type Profile, type Settings } from '@/types/cv'
import { cleanText, joinNonEmpty } from '@/features/resume-formatting'
import { type PdfStyles } from './types'

export function ResumePdfHeader({ profile, settings, styles }: { profile: Profile; settings: Settings; styles: PdfStyles }) {
  const contacts = joinNonEmpty([profile.email, profile.phone, profile.location, profile.website, profile.github, profile.linkedin])
  const name = cleanText(profile.name)
  const summary = cleanText(profile.summary)

  if (!name && !contacts && !summary) return null

  return (
    <View>
      {name && <Text style={styles.name}>{name}</Text>}
      {contacts && <Text style={styles.muted}>{contacts}</Text>}
      {summary && <Text style={{ marginTop: settings.profileSpacing }}>{summary}</Text>}
    </View>
  )
}
