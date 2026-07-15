# BizBridge Ethiopia — PROJECT.md

> Canonical source of truth for the project. Read this entire file before writing code.
> Last revised: **2026-06-01** (replaces the original Phase-1 planning spec — that document is
> obsolete; this one supersedes it).
>
> **2026-07-15 addendum — public-content pivot for launch.** Real demand right now is founders
> asking for guides on opening **design and software companies**. Accounts, dashboard, pricing,
> and checkout are gated behind `NEXT_PUBLIC_ENABLE_ACCOUNTS` (default off) so the launch site
> is 100% public content + a **Book a consult** CTA (Telegram + email + Formsubmit form at
> `/consult`). The paid-tier code is still in the tree — flip the flag when you're ready to
> sell. Deploy target: web app on Vercel; Fastify API deferred (nothing calls it while the flag
> is off). See `PROGRESS.md` for the 2026-07-15 change log.

---

## 1. What this is

BizBridge is a **personal project** by the owner — not a company, not a registered consultancy.
It sells **business research and a clear process** for opening a licensable business in
Ethiopia, with **Bishoftu / Debrezeit as the specialty** and the same content applicable across
Oromia and federal Ethiopia.

The owner explicitly does **not** run registrations on behalf of customers. Customers register
themselves. BizBridge helps by:

1. Selling **research** (Bishoftu market data, sector deep-dives, 519 official MOR codes with
   real fees, timelines, and ministry approvals).
2. Selling **the step-by-step process** for opening a business in each sector.
3. **Introducing Pro customers** to a small network of vetted local partners (legal, IT,
   logistics, hospitality, accounting, marketing).
4. **Pro tier gets a 30-min lawyer consult slot** for business-idea / business-model
   sanity-check before they go register.

### Target users

- Local entrepreneurs in Bishoftu / Oromia opening their first business
- Ethiopian diaspora abroad investing back home
- Foreign investors scoping Ethiopian market entry

---

## 2. Pricing model — one-time, three tiers

**No subscriptions. No recurring charges. No Stripe. No PayPal. No other rails.**

| Tier | Price | What it unlocks |
|---|---:|---|
| Free | $0 | 519 sector overviews, MOR lookup, Bishoftu Pulse public data, sector wizard, blog |
| Standard | **$29 one-time** | Full sector guide (steps, fees, approvals), cost calculator + PDF export, synced checklists, document templates, 3 research reports |
| Pro | **$149 one-time** | Everything + all research reports + 30-min lawyer consult slot + warm intros to partner network + priority email support |

Editable in Payload admin (Globals → PricingConfig). FX rate also lives there.

**Payment methods at `/checkout`:**

- **Chapa** (ETB) — real integration in `apps/api/src/services/chapa.service.ts`. Needs `CHAPA_SECRET_KEY` + `CHAPA_WEBHOOK_SECRET` to activate.
- **TeleBirr** (ETB) — stub matching Open API shape. Needs `TELEBIRR_APP_ID`, `TELEBIRR_APP_KEY`, `TELEBIRR_PUBLIC_KEY`, `TELEBIRR_SHORT_CODE`. Currently returns 503 "not configured."
- **Bank transfer / Remitly** (USD) — manual flow. User books, we email them CBE account details with a reference code, admin marks payment complete in Payload after receipt. No external API needed.

---

## 3. Tech stack & architecture

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces (turbo is bypassed — Windows binary issues) |
| Frontend | Next.js 15 (App Router, RSC) |
| CMS | Payload v3 embedded at `apps/web/src/app/(cms)` |
| API | Fastify 5 (`apps/api`) |
| DB | PostgreSQL via Neon (`eu-west-2`) |
| ORM | Drizzle (transactional tables); Payload owns content tables |
| Auth | Better Auth (email/password; Google OAuth scaffolded but not bound) |
| Payments | Chapa (live wiring) · TeleBirr (stub) · Bank transfer (manual) |
| File storage | Cloudflare R2 via `@payloadcms/storage-s3` (not yet configured) |
| Email | Resend (not yet configured) |
| Charts | ApexCharts via `react-apexcharts` (SSR-disabled wrapper) |
| Type | Geist Sans + Geist Mono via `next/font` |
| UI primitives | Radix UI + shadcn-style wrappers at `apps/web/src/components/ui/` |
| Animation | `motion` (Framer Motion) |
| Lint | TypeScript strict + NodeNext module resolution |

### Schema ownership (load-bearing)

PostgreSQL is shared. Each tool owns its schema:

| Owner | Tables | Schema |
|---|---|---|
| **Payload** | `business_sectors`, `sector_categories`, `sector_license_requirements`, `sector_competency_certificates`, `sector_approvals`, `sector_costs`, `sector_steps`, `sector_documents`, `reports`, `experts`, `market_research`, `pages`, `blog_posts`, `media`, `admins` + Payload internals | `payload` |
| **Drizzle/Fastify** | `user`, `session`, `account`, `verification` (Better Auth) + `payments`, `subscriptions`, `bookings`, `user_report_purchases`, `user_checklists`, `user_checklist_items`, `expert_reviews` | `public` |

**Cross-schema foreign keys are forbidden at the DB level.** Both tools would clash trying to
migrate the other's tables. Application code enforces referential integrity for cross-schema
references (e.g., `payments.metadata.report_slug` links to `reports.slug`).

### Workspace structure

```
bizguide/
├── PROJECT.md          ← canonical spec (this file)
├── CLAUDE.md           ← commands + decisions
├── SETUP.md            ← first-run Neon/env walkthrough
├── README.md           ← high-level
├── docs/mor/           ← MOR Directive 17/2011 source PDFs
├── apps/
│   ├── web/            ← Next.js + Payload v3 (admin at /admin)
│   └── api/            ← Fastify + Drizzle + Better Auth
└── packages/
    ├── shared/         ← Zod schemas, constants, access matrix
    ├── ui/             ← `@bizbridge/ui` minimal primitives (most UI in apps/web)
    └── config/         ← tsconfig + Tailwind preset
```

---

## 4. Brand & design system

### Palette (deep forest mono)

User explicitly rejected the previous emerald + saffron palette. **No orange anywhere. No
separate accent colour that pulls away from green.** Everything green-consistent.

**Dark theme (default):**

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0A0F0D` | Page background |
| `--surface` | `#0F1614` | Card / panel |
| `--surface-2` | `#15201D` | Elevated card |
| `--surface-3` | `#1D2A26` | Highest elevation |
| `--ink` | `#E6E4D9` | Body text (warm off-white) |
| `--ink-muted` | `#9CA098` | Secondary text |
| `--ink-faint` | `#6A716A` | Captions / labels |
| `--border` | `#1D2A26` | Hairlines |
| `--border-strong` | `#2C3D38` | Emphasized borders |
| `--brand` | `#1B7758` | Primary — mature emerald |
| `--brand-strong` | `#0F4D3D` | Hover / deep forest |
| `--brand-muted` | `#0A2820` | Subtle brand bg |
| `--accent` | `#3FAB89` | Brighter brand variant (NOT orange) |

Light theme mirrors with cream `#F5F2E8` background, deep forest `#0F4D3D` primary.

All defined in `apps/web/src/app/globals.css`. Tailwind config in
`packages/config/tailwind.preset.cjs` consumes them via `rgb(var(--token) / <alpha-value>)`.

### Typography

- **Display + body**: Geist Sans (via `next/font`)
- **Mono**: Geist Mono (used for MOR codes, numbers, reference codes)
- **Amharic**: Noto Sans Ethiopic (fallback to Abyssinica SIL)
- Tracking: `tracking-tightish` (-0.015em) on body large, `tracking-crisp` (-0.022em) on display

### Voice

- Concise. Professional. Never desperate or hard-selling.
- **No money or price asks in the homepage hero.** The hero shows what it is, not what it costs.
- CTAs in context (sector detail, pricing page, checkout) — not on every page.
- Personal-project framing throughout: "we" / "I" voice, not corporate.

---

## 5. Status as of 2026-06-01

Dev server runs via `pnpm dev:web` on `http://localhost:3000`. All 19 user-facing routes
return 200.

### Done

- Monorepo scaffold, Next.js + Payload embedded admin, Fastify + Drizzle
- Neon Postgres provisioned (`eu-west-2`), all migrations applied
- MOR seed: **9 categories, 519 business sectors, 305 license requirements, 475 ministry approvals**
- Theme system: dark default + light toggle via `next-themes`, CSS-variable palette swap
- Radix-based UI primitives at `apps/web/src/components/ui/`: Button, Input, Label, Card, Badge, Dialog, Sheet, Dropdown, Popover, Tabs, Tooltip, Switch, Slider, Progress, Separator, ScrollArea, Accordion, Skeleton, Command, plus theme/currency/lang toggles
- Marketing pages: `/`, `/sectors`, `/sectors/[slug]`, `/lookup`, `/bishoftu`, `/compare`, `/calculator`, `/checklist`, `/wizard`, `/reports`, `/reports/[slug]`, `/about`, `/lawyer`, `/blog`, `/blog/[slug]`, `/partners`, `/checkout`, `/pricing`
- Auth pages: `/login`, `/signup` with Better Auth client
- Dashboard with ApexCharts (activity area, sector breakdown donut)
- Command palette (Cmd/Ctrl-K) with sector search + navigation
- Mobile responsive everywhere + mobile nav Sheet drawer
- Sector detail with gated premium sections (license, approvals, costs, steps, certs, docs)
- Sector decision wizard (5 questions → 3 recommendations)
- Bishoftu Pulse data dashboard (donut + range bar timeline + FX area chart)
- Cost calculator with live bar chart + ETB/USD formatter
- Setup checklist with localStorage persistence + progress ring chart
- Partners directory (6 listings: Doxa Classic, Feeder Delivery, Lake Tech, Addis Business Law, Oromia Accounting, Bishoftu Marketing)
- Subtle marquee logo bar on homepage (no big rectangles per design feedback)
- Blog: index + post detail with reading time
- Chapa real integration with HMAC-SHA256 webhook verification + re-verify-by-API + idempotency
- TeleBirr service stub matching Open API shape
- Bank transfer / Remitly manual checkout flow
- Unified `/checkout` page with 3-method picker
- Sitemap + robots.txt
- `Home` link in navbar (user-requested)
- Geist + Geist Mono fonts wired via `next/font`

### Known data quality / minor issues

- **518 vs 519 sectors in DB.** One sector lost due to a duplicate slug collision from the 7 sector codes that have typos in the MOR directive itself (preserved as `mor_code_alt` in `sectors.json`). Decide: drop the duplicate, or generate uniqueish slug suffix.
- **English sector names are word-glued from the PDF** (`"Growingofcereals"`). CamelCase auto-split is applied but lowercase-concat words remain. Fix the most-viewed ~50 manually in Payload admin, or write a word-splitter post-pass.
- **Dev server occasionally OOMs** when compiling `/admin` cold. Workaround documented: `NODE_OPTIONS=--max-old-space-size=4096 pnpm --filter @bizbridge/web dev`.
- **Partner URLs are all `.example` placeholders.** Edit `apps/web/src/lib/partners.ts` when real URLs land.
- **Mock data is in place for charts that would otherwise be empty.** Replace `GROWTH_MOCK` in `apps/web/src/components/marketing/home-charts.tsx`, the mock blog posts in homepage's `MOCK_BLOG`, and the synthetic FX history in Bishoftu Pulse when real data is sourced.

---

## 6. Implementation plan (what's left, prioritized)

### Tier 1 — Wire payments end-to-end (required for first sale)

#### 1.1 Mount Better Auth handler on Fastify

The signup/login forms call Better Auth which hits `/api/auth/*` on the API server. The
Fastify routes file exists (`apps/api/src/routes/auth/index.ts`) but currently returns 501.
Need to bind Better Auth's HTTP handler to Fastify.

**Files:** `apps/api/src/routes/auth/index.ts`, `apps/api/src/plugins/auth.ts`

**Implementation:**
```ts
// In auth route — register a catch-all
app.all('/*', async (req, reply) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const response = await app.auth.handler(new Request(url.toString(), {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  }))
  reply.code(response.status)
  response.headers.forEach((v, k) => reply.header(k, v))
  return reply.send(await response.text())
})
```

Test: signup form on `/signup` should create a row in `public.user`. Login should set the
`better-auth.session_token` cookie. Dashboard should read the session.

**Acceptance:** A new account created via `/signup` persists in `public.user` and the user
sees their tier badge on `/dashboard`.

#### 1.2 Tier-grant after payment

When Chapa webhook fires and `verifyTransaction` returns `success`, the existing payments
handler updates `payments.status='completed'` and inserts a `subscriptions` row. **That row
should also push `user.subscription_tier`** to `'basic'` (Standard) or `'pro'`.

**Files:** `apps/api/src/routes/payments/index.ts` (Chapa webhook handler)

```ts
if (verified.status === 'success') {
  await app.db.update(payments).set({ status: 'completed' }).where(eq(payments.id, payment.id))
  const meta = payment.metadata as { kind?: 'tier' | 'report'; tier?: 'standard' | 'pro' }
  if (meta.kind === 'tier' && meta.tier) {
    await app.db.update(user).set({
      subscriptionTier: meta.tier === 'pro' ? 'pro' : 'basic',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: null, // one-time = no expiry
    }).where(eq(user.id, payment.userId))
  }
}
```

**Acceptance:** User completes Chapa sandbox payment → returns to dashboard → tier badge updates from FREE to STANDARD/PRO.

#### 1.3 Admin page to mark bank transfers complete

Bank-transfer payments land as `status: pending` and the user emails receipt. Need an admin
view where the operator clicks "Mark received" and triggers the same tier-grant as Chapa.

**Files:** New Payload admin route or a custom collection view in
`apps/web/src/payload/collections/`. Or simpler: a custom Payload-admin button on the
`payments` collection (if exposed) that hits a Fastify endpoint `/api/admin/payments/:id/mark-paid`.

Quickest path: expose a `payments` Payload collection that reads from `public.payments`
(needs cross-schema query) OR just add a simple Fastify admin endpoint protected by an admin
JWT and a Payload-admin custom view.

**Acceptance:** Owner sees pending bank transfers in admin, clicks confirm, user gets tier.

#### 1.4 TeleBirr live wiring

When TeleBirr keys are available, implement `initiate()` in
`apps/api/src/services/telebirr.service.ts`. TeleBirr Open API uses RSA-encrypted JSON
signed with merchant private key. Doc: https://developer.ethiotelecom.et

**Files:** `apps/api/src/services/telebirr.service.ts`, new webhook at
`apps/api/src/routes/payments/index.ts` (`POST /api/webhooks/telebirr`).

**Acceptance:** TeleBirr sandbox payment completes end-to-end + grants tier.

---

### Tier 2 — Content authoring (required for first paying customer to get value)

#### 2.1 Author the first 5 research reports

Owner writes 5 PDF reports targeting Bishoftu's top sectors (hospitality, F&B, logistics,
tourism, retail). Upload via Payload admin → `reports` collection. Each report:
- Title, slug, description (Markdown), price_usd, price_birr
- Cover image upload
- Preview file upload (free 5-10 pages)
- Full file upload (gated — see 2.3)
- Sector relation (optional)

**Acceptance:** `/reports` lists real reports, `/reports/[slug]` shows real description, buy
flow reaches Chapa with real price.

#### 2.2 Author the first 3 blog posts

Real long-form content. Categories: opening-a-business, sector-deep-dives, bishoftu-economy.
Upload via Payload admin → `blog-posts`. Each: title, slug, excerpt (max 300 chars), content
(Lexical rich-text), cover_image, tags, published_at, sector relation if applicable.

**Acceptance:** `/blog` shows real posts, blog post body renders Lexical content (see 2.4).

#### 2.3 R2 file storage live

The Payload S3 storage plugin is configured in `apps/web/src/payload.config.ts` but disabled
without R2 env vars. To enable:
1. Create a Cloudflare R2 bucket (`bizbridge-media`)
2. Generate API token + access key
3. Fill `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
   `R2_PUBLIC_URL`, `R2_ENDPOINT` in `apps/web/.env`
4. Configure CORS on the bucket for `localhost:3000` + production domain
5. Restart Payload — uploads now go to R2

**Acceptance:** Image upload in Payload admin lands in R2 and renders via `R2_PUBLIC_URL`.

#### 2.4 Render Payload Lexical rich-text in blog post body

Currently the blog post page (`apps/web/src/app/(marketing)/blog/[slug]/page.tsx`) shows
mock paragraphs because Lexical-to-React isn't wired. Payload v3 exports
`@payloadcms/richtext-lexical/react` (RichText component) — drop it in.

**Files:** `apps/web/src/app/(marketing)/blog/[slug]/page.tsx`

```tsx
import { RichText } from '@payloadcms/richtext-lexical/react'
// ...
<RichText data={post.content} converters={defaultJSXConverters} />
```

**Acceptance:** Blog post body renders headings, lists, blockquotes, links, embedded
images from Lexical editor output.

#### 2.5 Real partner URLs + logos

Replace `.example` URLs in `apps/web/src/lib/partners.ts` with real ones. Eventually:
- Move partners to a Payload `partners` collection so the owner can edit without code
- Add real logo upload field (replaces the initial-based `BrandMark`)

**Acceptance:** Partner card click opens the real partner site in a new tab.

---

### Tier 3 — Polish + production-ready

#### 3.1 Transactional emails via Resend

Send emails on: signup welcome, payment success, lawyer-call booking confirmation, partner
intro made, bank-transfer-pending receipt, report purchase + download link.

**Files:** Implement `apps/api/src/services/email.service.ts` with Resend SDK. Trigger from
auth, payment-webhook, and admin actions.

Templates can be plain HTML strings initially; upgrade to React Email later.

**Acceptance:** Signup → email lands. Payment → confirmation email with download link or tier-grant notice.

#### 3.2 Cal.com booking for the lawyer slot

Pro members see a "Book your slot" button on `/dashboard` and `/lawyer`. Embed Cal.com
`https://cal.com/embed` for the lawyer's calendar. After booking, Cal.com fires a webhook to
`POST /api/webhooks/cal` → we mark the slot used.

**Files:** `apps/web/src/app/(marketing)/lawyer/page.tsx` (gate the embed to `userTier='pro'`),
`apps/api/src/routes/payments/index.ts` (or new bookings handler).

**Acceptance:** Pro user clicks Book → Cal.com inline picker → booking created in user's
calendar + ours.

#### 3.3 Cost calculator: source real fee data

Heuristic numbers in `apps/web/src/app/(marketing)/calculator/calculator-client.tsx` need
replacing with real MOR fee schedule. Owner sources from etrade.gov.et + ministry fee tables
and updates the `sector_costs` Payload collection (per-sector fees). Calculator queries via
Payload Local API.

**Acceptance:** Calculator shows real ETB fee for a real sector (e.g., MOR `64114` Restaurant
service → known ETB X for trade licence).

#### 3.4 Author step-by-step process per sector

Use Payload admin to add `sector_steps` rows. For the 50 highest-priority sectors,
write 6–10 steps each with title, description, where_to_go, documents_needed,
estimated_days, tier_required (first step always `free`, rest `premium`).

**Acceptance:** Sector detail page shows real steps; Standard subscribers see all, Free
users see only step 1.

#### 3.5 MeiliSearch full-text search

Replace the current Payload-REST-backed `Cmd-K` search with MeiliSearch for fuzzy / multilingual
search. Self-host on the same box as the API or use Meili Cloud free tier.

**Files:** `apps/web/src/components/command-palette/command-palette.tsx` swap fetch target.

**Acceptance:** Search "kafa" → finds "Cafe and breakfast service" via fuzzy match.

#### 3.6 Sector knowledge graph

A visual sector explorer at `/sectors/explore` — force-directed graph of parent → child →
sibling relationships across 519 codes. Uses `react-force-graph` or D3. Built from the
hierarchical MOR code structure (`xxxxx` first digit = category, first 3 digits = major
group, first 4 = group, full 5 = leaf).

**Acceptance:** User clicks any node → navigates to sector detail.

#### 3.7 Email digest signup

Quiet email-capture pill at the bottom of homepage, blog, and Bishoftu Pulse. Stores email
in a Payload `subscribers` collection. Owner sends weekly Bishoftu opportunity digest via
Resend's broadcast API.

**Acceptance:** Email entered → row in `subscribers` → confirmation email lands.

#### 3.8 Amharic translations (chrome only)

The `LangToggle` component switches a flag but does nothing functional. Wire `next-intl` to
serve translated chrome (nav, footer, CTAs, common labels). Sector descriptions stay EN
until per-sector AM authoring lands.

**Files:** `apps/web/i18n/`, `next-intl` middleware, message JSON files.

**Acceptance:** Toggle to AM → nav says "ቤት / ዘርፎች / ምርምር / ..." etc.

---

### Tier 4 — Infra & ops

#### 4.1 Vercel deploy for Next.js

Connect the repo to Vercel. Set env vars (DATABASE_URL, PAYLOAD_SECRET, BETTER_AUTH_SECRET,
NEXT_PUBLIC_API_URL pointing to production Fastify host). Auto-deploy main branch.

Watch out for: Payload admin needs ample memory on Vercel — may need to ship admin on a
side-deploy.

#### 4.2 Fastify deploy

Options:
- Dokploy on a Hetzner / DigitalOcean VPS (originally planned)
- Railway / Render / Fly.io (simpler)

Set up: HTTPS, env vars, log shipping, healthcheck endpoint (already at `/health`).

#### 4.3 Custom domain + DNS

Buy `bizbridge.et` or similar. Point apex to Vercel, API subdomain to the Fastify host.
Update `BETTER_AUTH_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`
env vars in prod.

#### 4.4 Git repo + first commit

Currently `bizguide/` has `git init` but **no commits**. The user wanted to review before
committing. Suggested first-commit structure:
- One commit: scaffold (Phase 1 - monorepo + Payload + Fastify + Drizzle)
- One commit: MOR seed + data
- One commit: design system + theme
- One commit: marketing pages
- One commit: payment integration (Chapa + TeleBirr stubs + bank transfer)

Push to a private GitHub repo when ready.

#### 4.5 Analytics

Plausible (self-hosted or cloud) or Posthog. Simple page-view + funnel from `/sectors` →
`/sectors/[slug]` → `/checkout` → completion. Don't use Google Analytics (privacy + ETB load
time).

#### 4.6 SEO

Already shipped: sitemap.xml, robots.txt, OpenGraph + Twitter metadata, JSON-LD friendly markup.

Pending:
- Submit sitemap to Google Search Console + Bing
- Build internal backlinks from `/lookup` to `/sectors/[slug]` and from blog posts to sectors
- Partner outbound links (already done; rel="noopener external" set)

---

## 7. Environment variables (what's set, what's pending)

Both `apps/web/.env` and `apps/api/.env` exist locally (gitignored). Production values
mirror these.

### Live and working

- `DATABASE_URL` — Neon pooled connection string (eu-west-2)
- `PAYLOAD_SECRET` — 64-char hex
- `BETTER_AUTH_SECRET` — 64-char hex
- `BETTER_AUTH_URL` — `http://localhost:3000` in dev
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`
- `NEXT_PUBLIC_API_URL` — `http://localhost:4000`
- `FRONTEND_URL` — `http://localhost:3000` (for Fastify CORS)
- `PORT`, `NODE_ENV`, `LOG_LEVEL` — apps/api basics

### Stubbed (will activate when filled)

- `CHAPA_SECRET_KEY`, `CHAPA_WEBHOOK_SECRET` — empty → Chapa returns 503
- `TELEBIRR_APP_ID`, `TELEBIRR_APP_KEY`, `TELEBIRR_PUBLIC_KEY` — empty → TeleBirr stub
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ENDPOINT` — empty → Payload uses local-disk fallback (broken in production)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — empty → emails logged to console only
- `CAL_API_KEY`, `CAL_BASE_URL` — empty → lawyer booking page shows static placeholder
- `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY` — empty → search uses Payload REST fallback
- `REDIS_URL` — empty → BullMQ workers not running
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — empty → Google OAuth not wired

---

## 8. Commands

All from repo root (`C:\Users\hp\Documents\Github\bizguide`).

```bash
# Install
pnpm install

# Dev — both apps in parallel
pnpm dev                                           # all apps
pnpm dev:web                                       # Next.js only (port 3000)
pnpm dev:api                                       # Fastify only (port 4000)

# If dev crashes when compiling /admin (Payload):
NODE_OPTIONS=--max-old-space-size=4096 pnpm dev:web

# Database (Drizzle owns the public schema)
pnpm db:generate                                   # SQL from schema/*.ts
pnpm db:migrate                                    # apply to Neon
pnpm db:studio                                     # browse data

# Payload (owns the payload schema, auto-pushes in dev)
pnpm payload:migrate                               # apply Payload migrations
pnpm payload:generate-types                        # regenerate src/payload-types.ts

# Seed (idempotent, batched, ~30s)
pnpm seed:mor

# Tools
pnpm --filter @bizbridge/web tools:parse-mor       # rebuild sectors.json from MOR PDF text

# Quality
pnpm typecheck                                     # workspace-wide via pnpm -r
pnpm build                                         # all apps
pnpm lint
```

---

## 9. Key decisions (chronological)

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-31 | pnpm workspaces; turbo bypassed | Turbo's Windows platform binary fails to install reliably |
| 2026-05-31 | Schema ownership split: Payload `payload` schema, Drizzle `public` schema | Avoid migration conflicts; clear boundary |
| 2026-05-31 | Better Auth uses `text` user IDs (not UUIDs as PROJECT.md v1 spec) | Match Better Auth defaults; less friction |
| 2026-05-31 | Batched MOR seed (Promise.all chunks of 25) | Row-by-row was ~10 min on Neon; batched is ~30s |
| 2026-06-01 | Dark default + light toggle | Premium B2B feel; user picked it |
| 2026-06-01 | Pivoted to deep-forest mono palette | User rejected emerald + saffron; "darker green, no orange" |
| 2026-06-01 | One-time pricing (Free / $29 / $149) | User: "It's not gonna be a subscription" |
| 2026-06-01 | Payment methods: Chapa + TeleBirr + Remitly bank transfer | User: "not Stripe, not any other methods" |
| 2026-06-01 | Removed Experts page from nav, added Lawyer as Pro-tier benefit | User: "remove experts, lawyer is Pro feature, not in nav" |
| 2026-06-01 | Repositioned: research + process + warm partner intros | User: "we help — not just research" |
| 2026-06-01 | Featured partners: Doxa Classic Restaurant, Feeder Delivery, +4 placeholders | User-named real Bishoftu businesses; SEO + trust |
| 2026-06-01 | Home link added to navbar | User: "have a Home link so they can go back" |
| 2026-06-01 | Marquee logos on homepage, no big card rectangles | User: "sliding or static logos, no big rectangles" |
| 2026-06-01 | Hero copy reverted: no price/CTA pressure | User: "don't ask for money in the hero, that's desperate" |
| 2026-06-01 | Hero CTAs: "Browse 519 sectors" + "Find my sector" | Discovery-first, not commerce-first |

---

## 10. Open questions / TODO for next session

1. **Should we drop the duplicate sector (518 vs 519)** or generate a `-alt` slug for it?
2. **Featured-partners structure** — keep in code (`lib/partners.ts`) or move to a Payload collection? Affects ease of editing.
3. **Lawyer call calendar** — Cal.com or owner's personal Google Calendar via Google Calendar API? Cal.com is easier; GCal is more personal.
4. **Currency display rule on sector detail pages** — current calc shows fees in both ETB and USD; should it default to the visitor's currency preference (already in CurrencyProvider context)?
5. **First-commit strategy** — atomic by phase, or one big squash? Owner preference.
6. **Domain name** — `bizbridge.et`? Other? Affects email setup, OAuth callback URLs, Better Auth `baseURL`.

---

## 11. Notes for future Claude sessions

When you (Claude Code CLI) open this project:

1. **Read this PROJECT.md first.** It is the canonical truth as of 2026-06-01. The original
   PROJECT.md spec from project bootstrap is obsolete and has been replaced.
2. **Then read `CLAUDE.md`** for commands and conventions.
3. **Then read `SETUP.md`** if first-run setup is needed.
4. **Read `apps/web/src/seed/README.md`** if working on data/seed.
5. **Check the memory file `~/.claude/projects/C--Users-hp/memory/project_bizbridge-ethiopia.md`**
   for the latest cross-session pointers.

**Things you can do without asking the user:**
- Edit code, refactor, add components, add pages
- Run `pnpm dev:web`, `pnpm typecheck`, `pnpm build`
- Update `apps/web/.env` if you need to add a new env var key (set it blank)
- Make changes to `partners.ts`, mock chart data, copy
- Restart the dev server (kill the node process on port 3000 first)

**Things to ask before doing:**
- Changing the palette, type system, or fundamental design decisions
- Renaming routes that already exist (SEO + bookmarks)
- Modifying the database schema (Drizzle or Payload)
- Adding new payment methods
- Anything involving real money / live credentials
- Git commits (owner wants to review)

**Things to never do:**
- Add Stripe, PayPal, or any payment rail beyond Chapa + TeleBirr + Bank transfer
- Reintroduce subscriptions / recurring billing
- Add orange accent colours or anything tonally inconsistent with the forest-green mono palette
- Position the product as "we run your registration" — we don't, the customer does
- Add a corporate "We are a company" framing — this is a personal project
- Put price/upsell pressure in the homepage hero
- Show big-rectangle partner card sections on the homepage (only the marquee + dedicated `/partners` page)
- Skip migrations or push to production without the owner's explicit go-ahead
