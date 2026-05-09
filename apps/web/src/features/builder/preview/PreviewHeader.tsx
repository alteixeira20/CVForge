import { type Profile, type Settings } from '@/types/cv'

interface PreviewHeaderProps {
  profile: Profile
  settings: Settings
}

export function PreviewHeader({ profile, settings }: PreviewHeaderProps) {
  const contacts = [
    profile.email,
    profile.phone,
    profile.location,
    profile.website,
    profile.github,
    profile.linkedin,
  ].filter(Boolean)

  return (
    <div className="space-y-4 text-center">
      <h2 className="font-bold tracking-tight uppercase" style={{ fontSize: settings.nameFontSize }}>
        {profile.name || 'Your Name'}
      </h2>
      <div
        className="flex flex-wrap justify-center gap-x-12 gap-y-4 font-medium text-gray-600"
        style={{ fontSize: Math.max(9, settings.fontSize - 2) }}
      >
        {contacts.map((contact, index) => <span key={`${contact}-${index}`}>{contact}</span>)}
      </div>
    </div>
  )
}
