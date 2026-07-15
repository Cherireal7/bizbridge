# PROGRESS

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
