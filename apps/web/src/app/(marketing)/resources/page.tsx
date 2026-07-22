import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Download,
  ExternalLink,
  Landmark,
  MessageCircle,
  Scale,
  Send,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'

export const metadata: Metadata = {
  title: 'Resources — legal explainers, forms, official portals',
  description:
    'Free Ethiopian business & tax law explainers in Amharic, downloadable forms, and links to every official portal you need to start a business — MOR, MoTRI, EIC, ERCA, eTrade.',
}

const LEGAL_ARTICLES: {
  title_am: string
  title_en: string
  url: string
  date: string
  topic: string
}[] = [
  {
    title_am: 'መሠረታዊ የሆነ የህግ ስህተት ምን ማለት ነው?',
    title_en: 'What counts as a fundamental legal error?',
    url: 'https://samuelgirma.com/2022/08/22/%e1%88%98%e1%88%a0%e1%88%a8%e1%89%b3%e1%8b%8a-%e1%8b%a8%e1%88%86%e1%8a%90-%e1%8b%a8%e1%88%85%e1%8c%8d-%e1%88%b5%e1%88%85%e1%89%b0%e1%89%b5-%e1%88%9d%e1%8a%95-%e1%88%9b%e1%88%88%e1%89%b5-%e1%8a%90/',
    date: '2022-08-22',
    topic: 'Procedure',
  },
  {
    title_am: 'የሰበር አቤቱታን በሰበር ሰሚ ችሎት ስለማየት',
    title_en: 'Handling a cassation petition before the cassation bench',
    url: 'https://samuelgirma.com/2022/08/22/%e1%8b%a8%e1%88%b0%e1%89%a0%e1%88%ad-%e1%8a%a0%e1%89%a4%e1%89%b1%e1%89%b3%e1%8a%95-%e1%89%a0%e1%88%b0%e1%89%a0%e1%88%ad-%e1%88%b0%e1%88%9a-%e1%89%bd%e1%88%8e%e1%89%b5-%e1%88%b5%e1%88%88%e1%88%9b/',
    date: '2022-08-22',
    topic: 'Procedure',
  },
  {
    title_am: 'የዋስትና አይነቶች',
    title_en: 'Types of guarantees',
    url: 'https://samuelgirma.com/2022/08/19/%e1%8b%a8%e1%8b%8b%e1%88%b5%e1%89%b5%e1%8a%93-%e1%8a%a0%e1%8b%ad%e1%8a%90%e1%89%b6%e1%89%bd/',
    date: '2022-08-19',
    topic: 'Contract',
  },
  {
    title_am: 'የተከራዩትን ቤት ስለማደስ',
    title_en: 'Rules on repairs to leased property',
    url: 'https://samuelgirma.com/2022/08/13/%e1%8b%a8%e1%89%b0%e1%8a%a8%e1%88%ab%e1%8b%a9%e1%89%b5%e1%8a%95-%e1%89%a4%e1%89%b5-%e1%88%b5%e1%88%88%e1%88%9b%e1%8b%b0%e1%88%b5/',
    date: '2022-08-13',
    topic: 'Real estate',
  },
  {
    title_am: 'የመኪና ባለቤት ሀላፊነት እስከምን ድረስ ነው?',
    title_en: 'Extent of a vehicle owner’s liability',
    url: 'https://samuelgirma.com/2022/05/02/%e1%8b%a8%e1%88%98%e1%8a%aa%e1%8a%93-%e1%89%a3%e1%88%88%e1%89%a4%e1%89%b5-%e1%88%80%e1%88%8b%e1%8d%8a%e1%8a%90%e1%89%b5-%e1%8a%a5%e1%88%b5%e1%8a%a8%e1%88%9d%e1%8a%95-%e1%8b%b5%e1%88%a8%e1%88%b5/',
    date: '2022-05-02',
    topic: 'Liability',
  },
  {
    title_am: 'የህዝብ የሆነ የማይንቀሣቀስ ንብረት ባለቤትነት የሚረጋገጠው እንዴት ነው?',
    title_en: 'How ownership of public immovable property is verified',
    url: 'https://samuelgirma.com/2022/05/02/%e1%8b%a8%e1%88%85%e1%8b%9d%e1%89%a5-%e1%8b%a8%e1%88%86%e1%8a%90-%e1%8b%a8%e1%88%9b%e1%8b%ad%e1%8a%95%e1%89%80%e1%88%a3%e1%89%80%e1%88%b5-%e1%8a%95%e1%89%a5%e1%88%a8%e1%89%b5-%e1%89%a3%e1%88%88/',
    date: '2022-05-02',
    topic: 'Real estate',
  },
  {
    title_am: 'የዕድሜ ልክ ፅኑ እስራት ስንት ዓመት ነው?',
    title_en: 'How many years is a life sentence in Ethiopia?',
    url: 'https://samuelgirma.com/2022/05/04/%e1%8b%a8%e1%8b%95%e1%8b%b5%e1%88%9c-%e1%88%8d%e1%8a%ad-%e1%8d%85%e1%8a%91-%e1%8a%a5%e1%88%b5%e1%88%ab%e1%89%b5-%e1%88%b5%e1%8a%95%e1%89%b5-%e1%8b%93%e1%88%98%e1%89%b5-%e1%8a%90%e1%8b%8d-%e2%9d%93/',
    date: '2022-05-04',
    topic: 'Criminal',
  },
  {
    title_am: 'የኢትዮጵያ ሕገ-መንግሥት ታሪክ አጭር ዳሰሳ',
    title_en: 'A brief overview of the history of Ethiopia’s constitution',
    url: 'https://samuelgirma.com/2021/03/16/%e1%8b%a8%e1%8a%a2%e1%89%b5%e1%8b%ae%e1%8c%b5%e1%8b%ab-%e1%88%95%e1%8c%88-%e1%88%98%e1%8a%95%e1%8c%8d%e1%88%a5%e1%89%b5-%e1%89%b3%e1%88%aa%e1%8a%ad-%e1%8b%b3%e1%88%b0/',
    date: '2021-03-16',
    topic: 'Constitutional',
  },
]

const OFFICIAL_PORTALS: { name: string; role: string; url: string }[] = [
  {
    name: 'eTrade',
    role: 'Name reservation, trade license issuance, renewal — Ministry of Trade & Regional Integration',
    url: 'https://etrade.gov.et',
  },
  {
    name: 'Ministry of Revenue (MOR)',
    role: 'Tax registration (TIN), VAT/withholding, sector directives, code lookups',
    url: 'https://mor.gov.et',
  },
  {
    name: 'Ethiopian Investment Commission (EIC)',
    role: 'Foreign-investment licensing, capital tiers, sector eligibility for foreigners',
    url: 'https://investethiopia.gov.et',
  },
  {
    name: 'Ministry of Trade & Regional Integration',
    role: 'Trade regulation, business registration policy, dispute resolution',
    url: 'https://motri.gov.et',
  },
  {
    name: 'National Bank of Ethiopia',
    role: 'FX policy, capital-account rules, remittance and repatriation guidance',
    url: 'https://nbe.gov.et',
  },
  {
    name: 'Ethiopian Customs Commission',
    role: 'Import/export tariff schedules, HS codes, duty exemption programs',
    url: 'https://customs.gov.et',
  },
]

export default function ResourcesPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            <BookOpen className="h-3 w-3" /> Free resources
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Legal explainers, forms, and every portal you need.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            A curated shelf of Ethiopian business, tax and civil-law explainers — mostly in
            Amharic, English translations added where helpful. Plus direct links to every
            official portal you’ll actually use.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <a href="#legal-explainers">
                Read explainers <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#official-portals">
                Official portals <Landmark className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* TEBEKA CHANNEL */}
      <section className="container-page py-14 sm:py-16">
        <Card className="overflow-hidden">
          <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent">
                <MessageCircle className="h-3 w-3" /> Follow a lawyer directly
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tightish">
                Attorney Samuel Girma’s Telegram: ሕግ አገልግሎት (Legal Service)
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                Attorney Samuel Girma (Tebeka Samuel) runs a 133,000-subscriber Telegram
                channel with running Amharic explainers on Ethiopian criminal, civil, tax and
                business law. Highly recommended companion resource — BizBridge is not
                affiliated. Contact him at{' '}
                <a
                  href="tel:+251911190299"
                  className="font-medium text-ink hover:underline"
                >
                  +251 911 190 299
                </a>{' '}
                for representation.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <Button asChild size="lg">
                <a
                  href="https://t.me/tebekasamuel"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Send className="h-4 w-4" /> Open on Telegram
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a
                  href="https://samuelgirma.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLink className="h-4 w-4" /> samuelgirma.com
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* LEGAL EXPLAINERS */}
      <section id="legal-explainers" className="container-page py-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand">Legal explainers</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tightish sm:text-3xl">
              Plain-Amharic legal articles
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Published by Samuel Girma Law Office. Articles are hosted on their site and open
              in a new tab. English titles are BizBridge translations for browsability.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {LEGAL_ARTICLES.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-brand/40 hover:bg-surface-2"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{a.topic}</Badge>
                <span className="text-xs text-ink-faint">{a.date}</span>
              </div>
              <p className="mt-3 font-amharic text-base leading-snug text-ink group-hover:text-brand">
                {a.title_am}
              </p>
              <p className="mt-1.5 text-sm text-ink-muted">{a.title_en}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-brand">
                Read on samuelgirma.com <ExternalLink className="h-3 w-3" />
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* OFFICIAL PORTALS */}
      <section id="official-portals" className="container-page py-14 sm:py-16">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-brand">Official portals</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tightish sm:text-3xl">
            Every government portal you’ll actually touch
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            The primary online destinations for company formation, tax, foreign investment,
            trade and customs in Ethiopia.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_PORTALS.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-brand/40 hover:bg-surface-2"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-brand/15 text-brand">
                  <Building2 className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-ink group-hover:text-brand">{p.name}</p>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{p.role}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-brand">
                Open portal <ExternalLink className="h-3 w-3" />
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* DOWNLOADABLE FORMS — placeholder */}
      <section className="container-page py-14 sm:py-16">
        <div className="rounded-xl border border-dashed border-border bg-surface/60 p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/15 text-accent">
              <Download className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-accent">Downloadable forms — coming soon</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tightish">
                Sector-specific templates, contracts and checklists.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                We’re curating a shelf of downloadable Amharic + English forms:
                Memorandum &amp; Articles of Association templates, sector approval application
                forms, capital deposit letters, VAT registration templates, employment
                contracts, and more. If you have a form worth sharing, send it in.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/consult">
                    Contribute a form <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/lawyer">
                    Need a lawyer-drafted document? <Scale className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
