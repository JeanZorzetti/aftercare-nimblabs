import type { MetadataRoute } from 'next'
import { PROCEDURE_SLUGS } from '@/lib/tools/aftercare/procedures'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aftercare.nimblabs.com'
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...PROCEDURE_SLUGS.map((slug) => ({
      url: `${base}/aftercare/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
