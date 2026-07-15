import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const revalidate = 600
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const data = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'blog-posts',
      limit: 100,
      depth: 0,
    })
    return r.docs.map((p) => ({ slug: p.slug }))
  })
  return data ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return r.docs[0] ?? null
  })
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const data = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    const post = r.docs[0]
    if (!post) return null
    const related = await payload.find({
      collection: 'blog-posts',
      where: { id: { not_equals: post.id } },
      limit: 3,
      sort: '-published_at',
      depth: 0,
    })
    return { post, related: related.docs }
  })

  if (!data) notFound()
  const { post, related } = data

  // Reading time estimate
  const wordCount = JSON.stringify(post.content ?? {}).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(wordCount / 250))

  return (
    <article>
      <header className="border-b border-border bg-surface">
        <div className="container-page py-10 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-ink-faint hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All writing
          </Link>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-crisp sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-4 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-2xs uppercase tracking-wider text-ink-faint">
            {post.published_at ? (
              <span>
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            ) : null}
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {minutes} min read
            </span>
            {Array.isArray(post.tags) && post.tags.length > 0 ? (
              <>
                <span aria-hidden>·</span>
                {post.tags.slice(0, 3).map((t: { tag: string }) => (
                  <Badge key={t.tag} variant="outline">
                    {t.tag}
                  </Badge>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </header>

      <section className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6 text-pretty text-ink-muted">
          {post.excerpt ? (
            <p className="text-lg leading-relaxed text-ink">{post.excerpt}</p>
          ) : null}
          <p className="leading-relaxed">
            Most operators we&apos;ve worked with assume opening a business in Ethiopia is one
            big bureaucratic monolith. It&apos;s not. It&apos;s an ordered sequence of small,
            knowable steps — and the order matters more than the steps themselves.
          </p>
          <p className="leading-relaxed">
            What follows is the version we hand to people who want to do it themselves: each
            step in the right order, what to bring, who to talk to, how long it actually takes,
            and where it&apos;s safe to skip an office vs where you absolutely shouldn&apos;t.
          </p>
          <div className="rounded-lg border border-brand/40 bg-brand/5 p-5">
            <p className="text-xs uppercase tracking-wider text-brand">In this post</p>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              <li>· The actual sequence for Bishoftu / Oromia (not the Addis default)</li>
              <li>· Office locations, hours, and what each one wants to see</li>
              <li>· Three places first-time operators get stuck — and how to avoid them</li>
              <li>· The 8-week realistic timeline vs the 2-week optimistic one</li>
            </ul>
          </div>
          <p className="leading-relaxed">
            Most articles on opening a business in Ethiopia stop at &ldquo;visit the trade
            bureau.&rdquo; This one walks you through what happens after you walk in — and
            specifically, the things you should have brought that nobody told you to.
          </p>
          <p className="leading-relaxed text-ink-faint">
            <em>
              Full post body wiring against Payload Lexical lands with the editorial CMS pass.
              The structure above is the template every published post follows.
            </em>
          </p>
        </div>
      </section>

      <section className="container-page pb-12 sm:pb-16">
        <Card className="mx-auto max-w-2xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-brand">Want the full guide?</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tightish">
            Standard $29 unlocks every sector process.
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            One-time payment, lifetime access. The walk-through above plus 519 official MOR
            sectors, costs, ministry approvals, and document checklists.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/pricing">
                See pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/wizard">Find my sector first</Link>
            </Button>
          </div>
        </Card>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface">
          <div className="container-page py-12 sm:py-16">
            <h2 className="text-lg font-semibold tracking-tightish">Keep reading</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group rounded-lg border border-border bg-bg p-5 transition-colors hover:border-brand/40"
                >
                  <h3 className="text-base font-semibold tracking-tightish text-ink group-hover:text-brand">
                    {r.title}
                  </h3>
                  {r.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{r.excerpt}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  )
}
