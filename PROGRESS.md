# PROGRESS

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
