import type { Metadata } from 'next'
import { Homepage } from '@/components/home/Homepage'
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'CVForge',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'CVForge: build and analyze your CV locally',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

export default function Page() {
  return <Homepage />
}
