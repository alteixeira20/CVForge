import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import { CVProvider } from '@/context/CVContext'
import { LiveAnnouncements } from '@/components/accessibility/LiveAnnouncements'
import { siteConfig } from '@/lib/siteConfig'
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | CVForge',
  },
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  authors: [{ name: siteConfig.organizationName, url: siteConfig.familyUrl }],
  creator: siteConfig.organizationName,
  publisher: siteConfig.organizationName,
  keywords: [
    'CV builder',
    'resume builder',
    'CV analyzer',
    'ATS-style CV checker',
    'local-first',
    'PDF export',
    'JSON backup',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'CVForge — build and analyze your CV locally',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
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
  category: 'business',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CVProvider>
          {children}
          <LiveAnnouncements />
        </CVProvider>
      </body>
    </html>
  )
}
