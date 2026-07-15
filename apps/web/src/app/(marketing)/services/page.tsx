import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Check,
  FileCheck2,
  FilePenLine,
  FileX2,
  Landmark,
  Phone,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'

export const metadata: Metadata = {
  title: 'eTrade services · what they actually do',
  description:
    'The official Ministry of Trade & Regional Integration trade-license services, the real 9-step process to open a business in Ethiopia, and the entity-type capital requirements from the 2021 Commercial Code — plain language, cited, no signup.',
}

const ETRADE_SERVICES = [
  {
    icon: FileCheck2,
    slug: 'new',
    name: 'New Trade Licence',
    tagline: 'First-time licence for a new business',
    docs: ['Competency certificate (sector-specific, if required)', 'TIN certificate', 'Commercial registration certificate'],
    source:
      'motri.gov.et — trade-license service catalog',
    action: 'Apply on eTrade',
  },
  {
    icon: FilePenLine,
    slug: 'renew',
    name: 'Renewal of Trade Licence',
    tagline: 'Annual renewal (or every 6 months, per current rules)',
    docs: ['Audit report', 'Tax clearance certificate'],
    source: 'motri.gov.et',
    action: 'Renew on eTrade',
  },
  {
    icon: ScrollText,
    slug: 'amend',
    name: 'Amendment of Trade Licence',
    tagline: 'Change entity structure, shareholders, or scope',
    docs: [
      'Shareholder resolution minutes (when amending the MoA)',
      'Updated Memorandum & Articles of Association',
    ],
    source: 'motri.gov.et',
    action: 'Amend on eTrade',
  },
  {
    icon: FileX2,
    slug: 'cancel',
    name: 'Cancellation of Trade Licence',
    tagline: 'Formally close a business',
    docs: ['Tax clearance certificate'],
    source: 'motri.gov.et',
    action: 'Cancel on eTrade',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Trade name reservation',
    detail:
      'Submit 3 proposed names via the eTrade portal or your local Trade Bureau. First-choice availability confirmed same day; formal reservation issued in 1–3 days.',
    days: '1–3 days',
    office: 'eTrade portal · MoT sub-city bureau',
  },
  {
    n: '02',
    title: 'Lease / land agreement',
    detail:
      'Sign a notarised lease at your business address (required to authenticate documents in the next step). Industrial land is handled by EIDC.',
    days: '~7 days',
    office: 'Local sub-city land office · EIDC (industrial)',
  },
  {
    n: '03',
    title: 'Document authentication (DARA)',
    detail:
      'PLC / share company only. Authenticate MoA, name letter, address proof, shareholder agreements at the Document Authentication & Registration Agency. Sole proprietors skip.',
    days: '2–5 days',
    office: 'DARA, Addis Ababa',
  },
  {
    n: '04',
    title: 'Open bank account + deposit capital',
    detail:
      'Any commercial bank. Deposit the minimum capital for your entity (Br 15,000 for a domestic PLC per the 2021 Commercial Code). Bank issues a capital-deposit letter.',
    days: '1–3 days',
    office: 'Any Ethiopian commercial bank',
  },
  {
    n: '05',
    title: 'TIN registration',
    detail:
      'Sub-city small-taxpayers office. Biometric capture required. Increasingly issued automatically once commercial registration completes on the eTrade portal.',
    days: '1–3 days',
    office: 'Sub-city small-taxpayers office',
  },
  {
    n: '06',
    title: 'Commercial registration certificate',
    detail:
      'Apply at MoT / local Trade Bureau with application form, authenticated MoA (PLC), address proof, TIN certificate, capital-deposit letter. Valid one year.',
    days: '2–5 days',
    office: 'Ministry of Trade · sub-city Trade Bureau',
  },
  {
    n: '07',
    title: 'Competency certificate (if applicable)',
    detail:
      'On-site inspection by the sector ministry. Only required for health, food, transport, education, and specialised professional services — check your sector page.',
    days: 'variable',
    office: 'Sector ministry',
  },
  {
    n: '08',
    title: 'Trade / business licence',
    detail:
      'Submit the commercial registration certificate, TIN, and competency certificate (if applicable) to MoT / local Trade Bureau. Renewable every 6 months per current MoTRI rules.',
    days: '2–5 days',
    office: 'Ministry of Trade · sub-city Trade Bureau',
  },
  {
    n: '09',
    title: 'VAT / TOT registration',
    detail:
      'Turnover ≥ Br 1,000,000/yr (or ≥ 75% VAT-registered clients) ⇒ VAT. Otherwise TOT. Health + education sectors are exempt. Registered via SIGTAS at Ministry of Revenue.',
    days: '2–5 days',
    office: 'Federal Ministry of Revenue · SIGTAS',
  },
]

const ENTITIES = [
  {
    type: 'Sole Proprietorship',
    holders: '1 individual',
    minCapital: 'No statutory minimum',
    liability: 'Personal (unlimited)',
    note: 'Simplest structure; owner and business are legally the same person.',
  },
  {
    type: 'One-Person Company (OPC)',
    holders: '1 founder',
    minCapital: 'Br 15,000 (same as PLC)',
    liability: 'Limited to capital',
    note: 'Introduced in the 2021 Commercial Code; solo founder with corporate protection.',
  },
  {
    type: 'Private Limited Company (PLC)',
    holders: '2–50 shareholders',
    minCapital: 'Br 15,000 (domestic)',
    liability: 'Limited to capital',
    note: 'Most common form for SMEs. Shares are not freely transferable.',
  },
  {
    type: 'Share Company (S.C.)',
    holders: 'Minimum 5 shareholders',
    minCapital: 'Board-mandated (typically higher)',
    liability: 'Limited to capital',
    note: 'Freely transferable shares; mandatory board governance. Not covered in detail on this site — book a consult.',
  },
]

const FOREIGN_TIERS = [
  { profile: 'Wholly foreign-owned (general)', minCapital: 'USD 200,000' },
  { profile: 'Wholly foreign-owned — ICT, engineering, publishing', minCapital: 'USD 100,000' },
  { profile: 'Joint venture (foreign + Ethiopian, general)', minCapital: 'USD 150,000' },
  { profile: 'Joint venture (designated sectors)', minCapital: 'USD 50,000' },
]

export default function ServicesPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            <Landmark className="h-3 w-3" /> Official services
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            eTrade services{' '}
            <span className="text-ink-muted">— what they actually do.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            The Ministry of Trade &amp; Regional Integration runs four core services on the
            eTrade portal, and there&apos;s a nine-step process linking them. This page pulls
            the official service definitions into plain language — you still finish each step
            on the government portal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="https://etrade.gov.et" target="_blank" rel="noreferrer">
                Open eTrade portal <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/checklist">Interactive checklist</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Source: motri.gov.et service catalog · Ethiopian Commercial Code (Proc. 1243/2021) ·
            e-Trade OTRLS.
          </p>
        </div>
      </section>

      {/* 4 CORE SERVICES */}
      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            The four trade-licence services
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
            Every action on your licence goes through one of these.
          </h2>
          <p className="mt-3 text-pretty text-ink-muted">
            All four are delivered online via the OTRLS system at{' '}
            <a
              href="https://etrade.gov.et"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline"
            >
              etrade.gov.et
            </a>
            . You need an eTrade account for anything beyond the free public license checker.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ETRADE_SERVICES.map((s) => (
            <Card key={s.slug} className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold tracking-tightish text-ink">{s.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{s.tagline}</p>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  Required documents
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
                  {s.docs.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-2xs text-ink-faint">Source: {s.source}</p>
                <Button asChild size="sm" variant="ghost">
                  <a href="https://etrade.gov.et" target="_blank" rel="noreferrer">
                    {s.action} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 9-STEP PROCESS */}
      <section className="border-y border-border bg-surface">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              The 9-step process
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              From name reservation to tax registration.
            </h2>
            <p className="mt-3 text-pretty text-ink-muted">
              Order matters — each step depends on the previous one. Realistic end-to-end
              timeline is <strong className="text-ink">3–6 weeks</strong> for a domestic PLC,
              longer for foreign investment or sector-approval-heavy activities.
            </p>
          </div>
          <ol className="relative mx-auto max-w-3xl">
            <span
              aria-hidden
              className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-brand/50 via-brand/25 to-transparent sm:left-6"
            />
            {STEPS.map((s, i) => (
              <li key={s.n} className={i === STEPS.length - 1 ? 'relative pl-14 sm:pl-16' : 'relative pl-14 pb-8 sm:pl-16 sm:pb-10'}>
                <span
                  aria-hidden
                  className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border border-brand/30 bg-bg font-mono text-sm font-semibold text-brand shadow-sm sm:h-12 sm:w-12"
                >
                  {s.n}
                </span>
                <div className="rounded-xl border border-border bg-bg/60 p-5 sm:p-6">
                  <h3 className="text-base font-semibold tracking-tightish text-ink sm:text-lg">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-2xs uppercase tracking-wider text-ink-faint">
                    <span className="inline-flex items-center gap-1">
                      <Landmark className="h-3 w-3" /> {s.office}
                    </span>
                    <span className="inline-flex items-center gap-1">⏱ {s.days}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-3xl text-xs text-ink-faint">
            Source: Ministry of Trade &amp; Regional Integration (motri.gov.et), Ethiopian
            Investment Commission, DARA, Ministry of Revenue, and the 2021 Commercial Code
            (Proclamation 1243/2021). Order and timings are typical; individual offices vary.
          </p>
        </div>
      </section>

      {/* ENTITY TYPES */}
      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Entity types + capital
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
            Pick the structure that fits.
          </h2>
          <p className="mt-3 text-pretty text-ink-muted">
            The 2021 Commercial Code recognises eight structures. These four cover most local
            operators; foreign investors follow a separate capital regime (below).
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Entity type</th>
                <th className="px-4 py-3 font-medium">Holders</th>
                <th className="px-4 py-3 font-medium">Min capital</th>
                <th className="px-4 py-3 font-medium">Liability</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ENTITIES.map((e) => (
                <tr key={e.type}>
                  <td className="px-4 py-3 font-medium text-ink">{e.type}</td>
                  <td className="px-4 py-3 text-ink-muted">{e.holders}</td>
                  <td className="px-4 py-3 font-mono text-ink">{e.minCapital}</td>
                  <td className="px-4 py-3 text-ink-muted">{e.liability}</td>
                  <td className="px-4 py-3 text-ink-muted">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 max-w-3xl">
          <div className="flex items-start gap-3 rounded-lg border border-brand/25 bg-brand/5 p-4 text-sm text-ink-muted">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p>
              <strong className="text-ink">
                The Br 15,000 PLC minimum is a legal floor, not a budget.
              </strong>{' '}
              Very few PLCs actually run on it. Plan for rent, staff, inventory, licences, and
              the first two months of losses — realistic starting figure is
              Br 250,000–1,500,000 depending on sector. Use the{' '}
              <Link href="/calculator" className="text-brand hover:underline">
                cost calculator
              </Link>{' '}
              to size yours.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Foreign-investment tiers
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tightish sm:text-2xl">
            Capital requirements for non-Ethiopian ownership
          </h3>
          <div className="mt-5 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-ink-faint">
                <tr>
                  <th className="px-4 py-3 font-medium">Ownership profile</th>
                  <th className="px-4 py-3 font-medium">Min capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FOREIGN_TIERS.map((t) => (
                  <tr key={t.profile}>
                    <td className="px-4 py-3 text-ink">{t.profile}</td>
                    <td className="px-4 py-3 font-mono text-ink">{t.minCapital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Foreign investors also need Ethiopian Investment Commission (EIC) approval
            confirming the activity is open to their nationality. Some sectors are reserved
            for Ethiopian nationals only — check with EIC or book a consult.
          </p>
        </div>

        <p className="mt-8 text-2xs text-ink-faint">
          Source: 2021 Commercial Code (Proc. 1243/2021), Ethiopian Investment Commission,
          Mondaq Ethiopia company-registration guide (2026).
        </p>
      </section>

      {/* CONTACT */}
      <section className="border-t border-border">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Ministry of Trade</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tightish">Contact MoTRI directly</h3>
              <p className="mt-2 text-sm text-ink-muted">
                For questions about a specific licence, appeal, or delay.
              </p>
              <a
                href="tel:+251115153600"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
              >
                <Phone className="h-4 w-4" /> +251 115 15 36 00
              </a>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">eTrade portal</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tightish">Do it online</h3>
              <p className="mt-2 text-sm text-ink-muted">
                The four services above plus name reservation, licence checker, and account
                management. Requires an eTrade account.
              </p>
              <Button asChild size="sm" className="mt-4">
                <a href="https://etrade.gov.et" target="_blank" rel="noreferrer">
                  Open eTrade <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Verify a licence</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tightish">
                Public licence checker
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                Verify any Ethiopian business licence by number — no account needed.
              </p>
              <Button asChild size="sm" variant="secondary" className="mt-4">
                <a
                  href="https://etrade.gov.et/business-license-checker"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Open checker
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* SOURCES BIBLIOGRAPHY */}
      <section className="border-t border-border bg-surface">
        <div className="container-page py-12 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Sources</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tightish">Where this data came from</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>
              ·{' '}
              <a
                href="https://www.motri.gov.et/en/service_category/trade-license/view"
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                Ministry of Trade &amp; Regional Integration — trade-license service catalog
              </a>
            </li>
            <li>
              ·{' '}
              <a
                href="https://etrade.gov.et"
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                e-Trade Online Trade Registration &amp; Licensing System (OTRLS)
              </a>
            </li>
            <li>
              · Ethiopian Commercial Code — Proclamation No. 1243/2021 (Ministry of Justice)
            </li>
            <li>
              · MOR Directive 17/2011 — the source of all 519 sector codes on this site
            </li>
            <li>
              · Ethiopian Investment Commission — foreign-investment capital tiers
            </li>
            <li>
              · Legal Service Ethiopia + Mondaq Ethiopia company-registration guide (2026)
            </li>
          </ul>
          <p className="mt-6 rounded-md border border-border bg-bg/40 p-3 text-xs text-ink-faint">
            BizBridge is an independent civic-tech project. Not affiliated with the Government
            of Ethiopia, MoT, MOR, or any official body. Verify current rules on eTrade or with
            a licensed lawyer before you file anything.
          </p>
        </div>
      </section>
    </div>
  )
}
