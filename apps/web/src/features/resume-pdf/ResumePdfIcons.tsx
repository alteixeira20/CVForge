import { Circle, Path, Rect, Svg } from '@react-pdf/renderer'
import { type ReactNode } from 'react'

export type ResumePdfIconName = 'email' | 'phone' | 'location' | 'website' | 'github' | 'linkedin'

interface ResumePdfIconProps {
  name: ResumePdfIconName
  color: string
}

export function ResumePdfIcon({ name, color }: ResumePdfIconProps) {
  switch (name) {
    case 'email':
      return <EmailIcon color={color} />
    case 'phone':
      return <PhoneIcon color={color} />
    case 'location':
      return <LocationIcon color={color} />
    case 'website':
      return <WebsiteIcon color={color} />
    case 'github':
      return <GitHubIcon color={color} />
    case 'linkedin':
      return <LinkedInIcon color={color} />
  }
}

function IconShell({ children }: { children: ReactNode }) {
  return <Svg width={8} height={8} viewBox="0 0 16 16">{children}</Svg>
}

function EmailIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Rect x={2} y={3.5} width={12} height={9} rx={1} fill="none" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M2.5 4.5l5.5 4 5.5-4" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </IconShell>
  )
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Path
        d="M3.5 3.5h3l1.2 3-1.6 1.1a8 8 0 0 0 3.3 3.3l1.1-1.6 3 1.2v3a1 1 0 0 1-1.1 1A11 11 0 0 1 2.5 4.6 1 1 0 0 1 3.5 3.5z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  )
}

function LocationIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Path
        d="M8 14s5-4.2 5-8a5 5 0 1 0-10 0c0 3.8 5 8 5 8z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={6} r={1.8} fill="none" stroke={color} strokeWidth={1.4} />
    </IconShell>
  )
}

function WebsiteIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Circle cx={8} cy={8} r={5.5} fill="none" stroke={color} strokeWidth={1.4} />
      <Path
        d="M2.5 8h11M8 2.5c1.6 2 2.4 3.7 2.4 5.5S9.6 11.5 8 13.5C6.4 11.5 5.6 9.8 5.6 8S6.4 4.5 8 2.5z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  )
}

function GitHubIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Path
        d="M8 1.8a6.2 6.2 0 0 0-2 12.1c.3.1.4-.1.4-.3v-1.1c-1.7.4-2.1-.8-2.1-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.9-1.4-.2-2.8-.7-2.8-3 0-.7.2-1.3.7-1.7-.1-.2-.3-.8.1-1.7 0 0 .5-.2 1.7.6a6 6 0 0 1 3.2 0c1.2-.8 1.7-.6 1.7-.6.3.9.1 1.5 0 1.7.4.4.7 1 .7 1.7 0 2.3-1.4 2.8-2.8 3 .2.2.4.5.4 1.1v1.6c0 .2.1.4.4.3A6.2 6.2 0 0 0 8 1.8z"
        fill={color}
      />
    </IconShell>
  )
}

function LinkedInIcon({ color }: { color: string }) {
  return (
    <IconShell>
      <Rect x={2} y={2} width={12} height={12} rx={1.5} fill="none" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <Path
        d="M5 6.5v4M5 4.6v.1M8 10.5V7m0 0c.6-1 3-1.4 3 1v2.5"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  )
}
