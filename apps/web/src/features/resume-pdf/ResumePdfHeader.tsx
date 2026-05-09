import { Text, View } from '@react-pdf/renderer'
import { type Profile, type Settings } from '@/types/cv'
import { type PdfStyles } from './types'

export function ResumePdfHeader({ profile, settings, styles }: { profile: Profile; settings: Settings; styles: PdfStyles }) {
  const contacts = [profile.email, profile.phone, profile.location, profile.website, profile.github, profile.linkedin]
    .filter(Boolean)
    .join(' | ')

  return (
    <View>
      <Text style={styles.name}>{profile.name || 'Untitled CV'}</Text>
      {contacts && <Text style={styles.muted}>{contacts}</Text>}
      {profile.summary && <Text style={{ marginTop: settings.profileSpacing }}>{profile.summary}</Text>}
    </View>
  )
}
