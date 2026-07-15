import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Mail, MessageCircle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { CONSULT_EMAIL, CONSULT_FORMSUBMIT, CONSULT_TELEGRAM } from '@/lib/flags'

export const metadata: Metadata = {
  title: 'Book a consult',
  description:
    'Talk it through — sector selection, business model sanity check, warm intros. One-off consult, no subscription.',
}

interface PageProps {
  searchParams: Promise<{ sent?: string }>
}

export default async function ConsultPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const sent = sp.sent === '1'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="brand" className="mb-5 inline-flex">
              <Sparkles className="h-3 w-3" /> Book a consult
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
              Have a business idea?{' '}
              <span className="text-ink-muted">Let&apos;s talk it through.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
              Sector selection, entity type, licensing route, warm intros to the right ministry or
              partner. One-off consult, no subscription — the guides on this site stay free either
              way.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          <div className="space-y-4 lg:col-span-2">
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Fastest reply</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tightish">Message on Telegram</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Usually the quickest way — voice notes, screenshots, and back-and-forth in the same
                thread.
              </p>
              <Button asChild className="mt-4 w-full">
                <a href={CONSULT_TELEGRAM} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> Open Telegram
                </a>
              </Button>
            </Card>

            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Prefer email</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tightish">Write to us</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Tell us the sector, the city, and where you&apos;re stuck. Replies in a day or two.
              </p>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <a href={`mailto:${CONSULT_EMAIL}`}>
                  <Mail className="h-4 w-4" /> {CONSULT_EMAIL}
                </a>
              </Button>
            </Card>

            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">What we help with</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Picking the right MOR sector code (design vs. software vs. consulting, etc.)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Entity type — sole prop, PLC, or branch of a foreign company
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Which ministry approvals you actually need, in what order
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Warm intros to legal, accounting, IT, and logistics partners in Bishoftu
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 sm:p-8 lg:col-span-3">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tightish">Message received</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                  We&apos;ll get back to you at the address you provided — usually within a day or
                  two. If it&apos;s urgent, message on Telegram.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <a href={CONSULT_TELEGRAM} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" /> Open Telegram
                    </a>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/sectors">Keep browsing sectors</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-brand">Or send a note</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tightish">Tell us what you&apos;re working on</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  A couple sentences is enough. We&apos;ll reply from {CONSULT_EMAIL}.
                </p>
                <form
                  action={CONSULT_FORMSUBMIT}
                  method="POST"
                  className="mt-6 space-y-4"
                >
                  <input type="hidden" name="_subject" value="BizBridge consult request" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_next" value="/consult?sent=1" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required autoComplete="name" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sector">Sector interest (optional)</Label>
                    <Input
                      id="sector"
                      name="sector"
                      placeholder="e.g. software company, design studio, cafe, tour operator…"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">What are you working on?</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Business idea, where you're stuck, what would help most."
                      className="mt-1.5 flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_pref">Preferred contact (optional)</Label>
                    <Input
                      id="contact_pref"
                      name="contact_pref"
                      placeholder="Telegram @handle, phone number, or leave blank for email"
                      className="mt-1.5"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Send message
                  </Button>
                  <p className="text-xs text-ink-faint">
                    We&apos;ll never sell your details. Replies in a day or two.
                  </p>
                </form>
              </>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}
