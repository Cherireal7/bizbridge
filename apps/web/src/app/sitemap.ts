import type { MetadataRoute } from 'next'
import { tryPayload } from '@/lib/payload'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/sectors`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/experts`, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const dynamicEntries = await tryPayload(async (payload) => {
    const sectors = await payload.find({
      collection: 'business-sectors',
      where: { is_active: { equals: true } },
      limit: 1000,
      depth: 0,
    })
    return sectors.docs.map<MetadataRoute.Sitemap[number]>((s) => ({
      url: `${base}/sectors/${s.slug}`,
      changeFrequency: 'weekly',
      priority: s.is_featured ? 0.8 : 0.6,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
    }))
  })

  return [...staticEntries, ...(dynamicEntries ?? [])]
}
