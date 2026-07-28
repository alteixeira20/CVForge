import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import { CVProvider } from '@/context/CVContext'
import './globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CVForge - Local-first CV Builder',
    template: '%s | CVForge',
  },
  description:
    'Build, back up, export, and inspect a CV locally in the browser without an account.',
  // Static dark-UI favicons - the white Anvilary mark reads on dark browser chrome.
  icons: {
    icon: [
      { url: '/brand/anvilary-logo-mark-square-32-white.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/anvilary-logo-mark-square-16-white.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/anvilary-logo-mark-square-48-white.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/brand/anvilary-logo-mark-square-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CVProvider>{children}</CVProvider>
      </body>
    </html>
  )
}
