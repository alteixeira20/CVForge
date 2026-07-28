import { absoluteSiteUrl, siteConfig } from '@/lib/siteConfig'

export const cvForgeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.organizationName,
      url: siteConfig.familyUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteConfig.url}/#software`,
      name: siteConfig.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      url: siteConfig.url,
      image: absoluteSiteUrl('/opengraph-image'),
      description: siteConfig.description,
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@id': `${siteConfig.url}/#organization`,
      },
      featureList: [
        'Structured browser-based CV and resume editing',
        'Local browser autosave without an account',
        'Reliable JSON backup and restore',
        'PDF export with optional embedded CVForge session restoration',
        'Local ATS-style PDF extraction and CV improvement analysis',
        'Review-first best-effort external PDF import',
      ],
    },
  ],
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cvForgeStructuredData).replace(/</g, '\\u003c'),
      }}
    />
  )
}
