import type { MetadataRoute } from 'next'
import { tryPayload } from '@/lib/payload'

export const revalidate = 3600

const PUBLIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/sectors', changeFrequency: 'daily', priority: 0.95 },
  { path: '/consult', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/wizard', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/checklist', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/compare', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/lookup', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/bishoftu', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/reports', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/partners', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/lawyer', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const dynamicEntries = await tryPayload(async (payload) => {
    const sectors = await payload.find({
      collection: 'business-sectors',
      where: { is_active: { equals: true } },
      limit: 1000,
      depth: 0,
    })
    const sectorEntries = sectors.docs.map<MetadataRoute.Sitemap[number]>((s) => ({
      url: `${base}/sectors/${s.slug}`,
      changeFrequency: 'weekly',
      priority: s.is_featured ? 0.8 : 0.55,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
    }))

    const posts = await payload
      .find({ collection: 'blog-posts', limit: 500, depth: 0 })
      .catch(() => ({ docs: [] as Array<{ slug: string; published_at?: string | null; updatedAt?: string }> }))
    const postEntries = posts.docs
      .filter((p) => p.slug)
      .map<MetadataRoute.Sitemap[number]>((p) => ({
        url: `${base}/blog/${p.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
        lastModified: p.published_at
          ? new Date(p.published_at)
          : p.updatedAt
            ? new Date(p.updatedAt)
            : undefined,
      }))

    const reports = await payload
      .find({ collection: 'reports', limit: 500, depth: 0 })
      .catch(() => ({ docs: [] as Array<{ slug: string; updatedAt?: string }> }))
    const reportEntries = reports.docs
      .filter((r) => r.slug)
      .map<MetadataRoute.Sitemap[number]>((r) => ({
        url: `${base}/reports/${r.slug}`,
        changeFrequency: 'monthly',
        priority: 0.65,
        lastModified: r.updatedAt ? new Date(r.updatedAt) : undefined,
      }))

    return [...sectorEntries, ...postEntries, ...reportEntries]
  })

  return [...staticEntries, ...(dynamicEntries ?? [])]
}
