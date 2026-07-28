import { permanentRedirect } from 'next/navigation'

export default function ParserRedirectPage() {
  permanentRedirect('/analyzer')
}
