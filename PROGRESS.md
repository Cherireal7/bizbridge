# PROGRESS

## 2026-07-15 (session 3) — Deploy-ready cleanup

Third session same day. Cheri gave a big list of cleanup items after previewing
the site. Executed as one batch since most are independent.

### Copy scrub

- **Removed every `$29` / `$149` / paywall reference** in user-visible copy
  (sector detail hero CTA, wizard completion, lawyer page, reports CTA,
  partners CTA, blog post CTA, about page). Site no longer promises a paid
  tier anywhere it doesn't back it up.
- **Removed diaspora / foreign-investor framing** from user copy (hero,
  about, wizard, calculator, bishoftu, checklist, reports). USER_TYPES enum
  is still in `packages/shared/src/constants.ts` for future use, but the
  wizard question and calculator selector are gone — the site is now scoped
  to domestic operators. Note added in the lawyer page: foreign-branch
  structures need a consult, not a self-service page.

### Currency + language toggles removed

- `CurrencyToggle` + `LangToggle` no longer rendered in marketing layout,
  dashboard layout, mobile-nav. Component files kept (may reintroduce).
  `CurrencyProvider` still wraps the tree so the calculator's USD conversion
  still works — just no user-visible toggle.

### Bitcoin sign → Br

- Every `₿` prefix (8 sites in calculator + bishoftu + pulse-charts) replaced
  with `Br ` (Ethiopian birr). No more BTC symbol misuse.

### Calculator overhaul

- BUSINESS_TYPES trimmed to **sole proprietorship** and **PLC** only. Share
  company + foreign branch removed — we don't have accurate cost data for
  those; note points users to a consult instead.
- Added **PLC operating-capital callout**: explains that Br 15,000 is the
  legal MoJ floor, not a budget — realistic first-year runway is
  Br 250,000–1,500,000.
- Removed the "Premium — Export & save" locked teaser. Replaced with a
  working **Print / Save-as-PDF** button (uses browser print dialog with
  print-styled CSS) and a **CSV download** with source citation baked in.
- Added a prominent **"Open eTrade"** CTA in the summary column pointing to
  `https://etrade.gov.et` — that's where name reservation and TIN registration
  actually happen.
- Added source citation under the line-item chart:
  *"Ethiopian Commercial Code (Proclamation 1243/2021), MOR fee schedule, and
  local practitioner interviews (2025–2026)."*

### eTrade link-outs

- Primary CTA on **sector detail** pages is now **"Reserve name on eTrade"**
  (opens `etrade.gov.et` in a new tab).
- Calculator has an eTrade card next to the estimate.
- Consult page + lawyer page mention eTrade in context.

### Civic disclaimer

- Prominent footer block: *"Independent civic-tech project. Not affiliated
  with the Government of Ethiopia, Ministry of Trade, MOR, or any official
  body. Verify current rules on eTrade or with a licensed lawyer."*
- Data-source line separated in footer: *"Source: MOR Directive 17/2011"*.

### Icons — lucide-react

- `GeometricIcon` rewritten to render **lucide-react icons per MOR category
  slug** (Wheat, Pickaxe, Factory, Zap, HardHat, ShoppingBag, Truck, Landmark,
  Users). Fallback `Briefcase`. Same API as before, so no call-site changes.
  Tint per category matches the home-charts palette.

### SEO

- **New favicon**: `apps/web/src/app/icon.tsx` (64px), `apple-icon.tsx`
  (180px). Both are dynamic `ImageResponse` — a stylised **B** on the
  forest-green gradient.
- **New Open Graph image**: `apps/web/src/app/opengraph-image.tsx` (1200×630)
  — brand mark, hero headline, tagline, and provenance line. Used for Twitter
  cards too.
- Root `metadata` expanded: author + creator + publisher, richer keywords,
  canonical URL, robots directives, JSON-LD Organization schema (schema.org
  data for search + AI crawlers).
- **Sitemap expanded** from 4 static routes to 14 + all sector pages + blog
  posts + reports. Priorities/changeFrequency tuned per route type.

### Partners

- **Doxa Innovations** URL updated from `#` to `https://doxaplc.com`.
- **BR Photography** URL set to `''` (empty) with copy note *"Follow on
  Instagram / TikTok — no website."* Marquee component updated to render
  non-linked partners as `<span>` instead of a broken `<a>`.

### Follow-ups still open

- BR Photography Instagram / TikTok handles — waiting on Cheri.
- Real blog posts + Media collection with R2 credentials — writing section
  stays hidden until then.
- No API integration with eTrade (they don't publish one). Link-out only.

## 2026-07-15 (later) — Launch-ready polish

Second session same day, after previewing the site in prod mode. Cheri asked
for the site to feel less like a scaffold and more like a launch.

### Content

- **Hero:** H1 rewritten to *"Build a business without friction. In Ethiopia."*
  Subhead names the four value props (sectors, process, cost estimate,
  eTrade link).
- **City focus stat card:** *"Addis + Bishoftu"* — the site's real coverage
  isn't Bishoftu-only.
- **Partners marquee:** placeholder businesses (Doxa Classic, Lake Tech, etc.)
  removed. Real partners in place: **Fida Delivery**, **Doxa Innovations**,
  **BR Photography** (`apps/web/src/lib/partners.ts`). Fida Delivery URL is
  live (`fidadelivery.et`); Doxa + BR URLs marked `#` pending Cheri
  confirmation.
- **Writing section:** `MOCK_BLOG` constant deleted; homepage section now only
  renders when Payload returns real posts. "No placeholders" for launch.

### Structure & data

- **How it works** rebuilt as a **vertical timeline** with connecting rail,
  lucide-react icons (`FileText`, `ListChecks`, `MessageCircle`), and a CTA per
  step. Copy no longer mentions $29 / $149.
- **Home charts overhauled** (`apps/web/src/components/marketing/home-charts.tsx`):
  distinct per-category color palette keyed by slug, larger donut (h=420),
  bigger total, richer legend markers, bar chart with short display labels
  (`CATEGORY_SHORT` map) and 220px yaxis maxWidth so nothing truncates,
  colored bars per category, growth chart cleaned. Layout is now two equal
  panels `lg:grid-cols-2` with the growth chart full-width below.

### Sector name spacing

- **New helper `apps/web/src/lib/humanize-sector-name.ts`**: `OVERRIDES` map
  for high-traffic MOR codes (39141, 72131, 92191, plus 5 computer/wholesale
  codes) + heuristic greedy-longest-match against a ~200-word MOR-domain
  dictionary + punctuation spacing + CamelCase split.
- Applied at **9 render sites** across homepage, `/sectors`, `/sectors/[slug]`
  (header + metadata + related), `/compare`, `/checklist`, `/lookup`.
- Verified: `/sectors/[…]-39141` renders H1 and `<title>` as
  *"Software development (including design, enrichment, and implementation)"*.

### Full access (no paywall on content)

- **`GatedSection` short-circuited** to always render children
  (`apps/web/src/components/marketing/gated-section.tsx`). Removes all
  "$29 unlocks / Pro upgrade" curtains from sector detail pages in one line
  instead of editing 5 call sites. Preserves the component signature so
  gating can be re-enabled cleanly when the paid tier is ready.

### Perf / DX

- Added `loading.tsx` skeletons for `/sectors` and `/sectors/[slug]` — Suspense
  fallback renders instantly on client-side navigation, so the site no longer
  feels frozen while Payload queries Neon.
- `tryPayload` now always logs failures in production (was silent) — masked a
  Payload `in`-operator issue on the founder-sectors query. Swapped `in` for
  `or`+`equals` for portability.
- Verified: `pnpm --filter @bizbridge/web typecheck` clean;
  `pnpm --filter @bizbridge/web build` clean; prod smoke test on `:3000`
  confirms hero H1, partners, founder band, humanized sector detail all render
  correctly. Static pages 4–25ms; Neon-backed pages 3–7s locally (Vercel +
  same-region Neon will drop these to ~500ms–1.5s).

### Follow-ups still open

- Doxa Innovations + BR Photography URLs — waiting on Cheri.
- Real blog posts + Media collection with R2 (currently hidden, no
  placeholders shown).
- Category icons (lucide swap for `GeometricIcon` on the category grid) —
  scoped but not yet built.
- Fastify api (`apps/api`) is untouched and not deployed. Every server-side
  route in `apps/web` uses Payload directly.

## 2026-07-15 — Public-content pivot + feature flag

**Decision (Cherinet):** Real-world demand right now is people asking how to open **design and software companies** in Ethiopia. They want guides — not a signup wall. Paid tier ($29 / $149) and lawyer consult path stay in the code but are gated behind a feature flag so they can be turned back on later without a rewrite.

**Chosen scope:** *Hide, don't delete* + *Feature design/software, keep all 519 sectors*.

### What shipped

- `apps/web/src/lib/flags.ts` — single source of truth for `ENABLE_ACCOUNTS` (default `false`) and the consult contact endpoints (`CONSULT_EMAIL`, `CONSULT_TELEGRAM`, `CONSULT_FORMSUBMIT`).
- `apps/web/.env.example` — documents the new flags. Values on Vercel decide what's live.
- Layout-level `notFound()` guards on `(auth)/layout.tsx` and `(dashboard)/layout.tsx` — covers `/login`, `/signup`, `/dashboard` (and any future descendants) in one line each.
- Page-level guards on `(marketing)/pricing/page.tsx` and `(marketing)/checkout/page.tsx`.
- Marketing navbar + mobile-nav + footer now conditionally render pricing/login/signup links. When accounts are off, the CTA is **Book a consult**.
- Homepage: new **"For founders — Opening a design or software company?"** band featuring MOR sectors `39141`, `72131`, `92191` (queried by `mor_code`, so we don't guess slugs). "How it works" copy rewritten to drop $29 / $149 mentions. Final CTA swapped from `/pricing`+`/signup` to `/consult`+Telegram.
- New `/consult` page — Telegram + email cards + a Formsubmit form (name, email, sector, message, contact preference). Redirects to `/consult?sent=1` for the success state. Uses same UI conventions as the rest of marketing.
- Verified: `pnpm --filter @bizbridge/web typecheck` clean; `pnpm --filter @bizbridge/web build` clean (544 static pages). `pnpm lint` blocked by upstream Next 16 `next lint` deprecation — pre-existing, not from this cleanup.

### Not touched (intentionally)

- `apps/api` (Fastify) — auth/checkout/payment stubs left in place. Web app doesn't call them when accounts are off, so we can deploy web-only.
- Payload admin at `/admin` — still runs, still edits sector/blog content. That's needed for the site regardless of accounts.
- Chapa / TeleBirr / Better Auth env vars — still in `.env.example`. Just unused when the flag is off.
- `/lawyer` and `/wizard` pages — kept as-is; they're public content.

### Open — for the deploy session

- **GitHub repo** — none yet. New public repo `bizguide` under `Cherireal7`? Or an org?
- **Vercel project + domain** — bizbridge.et vs. `.vercel.app` for launch.
- **Env vars on Vercel** — `DATABASE_URL` (Neon prod branch), `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET` (still required by Payload/Auth even when hidden), `NEXT_PUBLIC_APP_URL`, plus the new `NEXT_PUBLIC_CONSULT_*`.
- **Consult contact defaults** — currently `hello@bizbridge.et` (unverified domain) and `https://t.me/cherinetdemeke` (placeholder). Confirm before first Formsubmit activation click.
- **PROJECT.md §10 open questions** — sector dedup, featured-partners location, currency default, first-commit strategy — still open.
