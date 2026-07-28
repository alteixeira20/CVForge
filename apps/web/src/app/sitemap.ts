import type { MetadataRoute } from 'next'
import { absoluteSiteUrl } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteSiteUrl('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteSiteUrl('/builder'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteSiteUrl('/analyzer'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
