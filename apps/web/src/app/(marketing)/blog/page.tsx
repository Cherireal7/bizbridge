import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Long-form on Bishoftu, the Ethiopian business environment, and the boring-but-critical bits of opening a business — from the BizBridge research team.',
}

export const revalidate = 600

export default async function BlogIndexPage() {
  const data = await tryPayload(async (payload) => {
    const res = await payload.find({
      collection: 'blog-posts',
      sort: '-published_at',
      limit: 30,
      depth: 1,
    })
    return res.docs
  })

  const posts = data ?? []
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            Writing
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Notes from the field.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            Bishoftu economic notes, the airport build, MOR directive analysis, and the parts
            of opening a business in Ethiopia nobody warns you about.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="container-page py-20">
          <Card className="p-12 text-center">
            <p className="text-sm font-medium text-ink">No posts published yet</p>
            <p className="mt-1 text-sm text-ink-muted">
              Editorial pipeline lives in the Payload admin. First posts ship soon.
            </p>
          </Card>
        </section>
      ) : (
        <>
          {featured ? (
            <section className="container-page pt-12 sm:pt-16">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-brand/40 hover:shadow-glow"
              >
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="aspect-[16/9] lg:aspect-auto lg:min-h-[320px] bg-gradient-to-br from-brand-muted via-surface-2 to-surface" />
                  <div className="flex flex-col gap-3 p-7 sm:p-10">
                    <p className="text-2xs uppercase tracking-wider text-brand">Featured</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightish text-ink group-hover:text-brand">
                      {featured.title}
                    </h2>
                    {featured.excerpt ? (
                      <p className="text-pretty text-ink-muted">{featured.excerpt}</p>
                    ) : null}
                    <p className="mt-auto text-2xs uppercase tracking-wider text-ink-faint">
                      {featured.published_at
                        ? new Date(featured.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Draft'}
                    </p>
                  </div>
                </div>
              </Link>
            </section>
          ) : null}

          <section className="container-page py-12 sm:py-16">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-brand/40"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-brand-muted via-surface-2 to-surface" />
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    {p.published_at ? (
                      <p className="text-2xs uppercase tracking-wider text-ink-faint">
                        {new Date(p.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    ) : null}
                    <h3 className="text-lg font-semibold tracking-tightish text-ink group-hover:text-brand">
                      {p.title}
                    </h3>
                    {p.excerpt ? (
                      <p className="line-clamp-3 text-sm text-ink-muted">{p.excerpt}</p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-brand pt-2">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
