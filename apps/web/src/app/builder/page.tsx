import type { Metadata } from 'next'
import { BuilderWorkbench } from '@/features/builder/workbench/BuilderWorkbench'
import { BUILDER_DESCRIPTION, BUILDER_TITLE } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: {
    absolute: BUILDER_TITLE,
  },
  description: BUILDER_DESCRIPTION,
  alternates: {
    canonical: '/builder',
  },
  openGraph: {
    type: 'website',
    url: '/builder',
    siteName: 'CVForge',
    title: BUILDER_TITLE,
    description: BUILDER_DESCRIPTION,
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'CVForge: build and analyze your CV locally',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BUILDER_TITLE,
    description: BUILDER_DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

export default function BuilderPage() {
  return <BuilderWorkbench />
}
