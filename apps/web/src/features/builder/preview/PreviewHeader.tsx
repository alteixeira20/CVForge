import { type Profile, type Settings } from '@/types/cv'
import { cleanText, joinNonEmpty } from '@/features/resume-formatting'

interface PreviewHeaderProps {
  profile: Profile
  settings: Settings
}

export function PreviewHeader({ profile, settings }: PreviewHeaderProps) {
  const contacts = joinNonEmpty([
    profile.email,
    profile.phone,
    profile.location,
    profile.website,
    profile.github,
    profile.linkedin,
  ]).split(' | ').filter(Boolean)
  const name = cleanText(profile.name)

  if (!name && contacts.length === 0) return null

  return (
    <div className="space-y-4 text-center">
      {name && (
        <h2 className="font-bold tracking-tight uppercase" style={{ fontSize: settings.nameFontSize }}>
          {name}
        </h2>
      )}
      {contacts.length > 0 && (
        <div
          className="flex flex-wrap justify-center gap-x-12 gap-y-4 font-medium text-gray-600"
          style={{ fontSize: Math.max(9, settings.fontSize-2) }}
        >
          {contacts.map((contact, index) => <span key={`${contact}-${index}`}>{contact}</span>)}
        </div>
      )}
    </div>
  )
}
