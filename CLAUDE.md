# CLAUDE.md — BizBridge Ethiopia

> **Reading order:** [`PROJECT.md`](./PROJECT.md) is the canonical spec — read that first, it
> was rewritten on **2026-06-01** to reflect every decision made through that date (palette
> pivot, one-time pricing, payment-method choices, partner positioning, etc.). This `CLAUDE.md`
> covers commands, conventions, and the implementation plan; `SETUP.md` is the first-run
> Neon/env walkthrough.

Working notes for Claude Code (and any other contributor). Read [`PROJECT.md`](./PROJECT.md) first.

---

## Commands

All commands run from the repo root.

> First-run? Read [`SETUP.md`](./SETUP.md) for the Neon + env walkthrough.

```bash
# install
pnpm install

# dev — both apps in parallel (Next.js on :3000, Fastify on :4000)
pnpm dev                # runs via `pnpm -r --parallel`; turbo isn't required
pnpm dev:web            # just the Next.js app
pnpm dev:api            # just the Fastify API

# build / typecheck / lint
pnpm build
pnpm typecheck
pnpm lint

# database (Drizzle, apps/api — payments/subscriptions/bookings/checklists/auth)
pnpm db:generate     # produce SQL from src/db/schema/*.ts
pnpm db:migrate      # apply migrations to DATABASE_URL
pnpm db:studio       # browse Drizzle data
pnpm db:seed         # placeholder until MOR seed runs through Payload

# Payload (apps/web — sectors/reports/experts/market_research/pages/blog/media)
pnpm payload:migrate          # apply Payload migrations
pnpm payload:generate-types   # regenerate src/payload-types.ts

# MOR seed (after Payload migrations have run)
pnpm --filter @bizbridge/web seed:mor          # upsert 9 categories + 519 sectors + licenses + approvals
pnpm --filter @bizbridge/web tools:parse-mor   # rebuild sectors.json from the source PDF text (rare)
```

---

## Architecture: who owns what schema

PostgreSQL is shared by `apps/web` (Payload) and `apps/api` (Fastify + Drizzle). To avoid both tools fighting over migrations, ownership is split by table:

| Owner | Tool | Migrations | Tables |
|---|---|---|---|
| **Payload** (apps/web) | `@payloadcms/db-postgres` (Drizzle internally) | `pnpm payload:migrate` | All editorial content — `business_sectors`, `sector_categories`, `sector_license_requirements`, `sector_competency_certificates`, `sector_approvals`, `sector_costs`, `sector_steps`, `sector_documents`, `reports`, `experts`, `market_research`, `pages`, `blog_posts`, `media`, plus Payload internals (`payload_*`). Schema lives in Postgres schema `payload`. |
| **Drizzle / Fastify** (apps/api) | `drizzle-kit` | `pnpm db:migrate` | Transactional / user-facing — `user`, `session`, `account`, `verification` (Better Auth), `payments`, `subscriptions`, `bookings`, `user_report_purchases`, `user_checklists`, `user_checklist_items`, `expert_reviews`. Schema lives in Postgres schema `public`. |
| **Better Auth** | Drizzle adapter, no separate migration tool | Created by Drizzle migrations | `user`, `session`, `account`, `verification`. App-specific columns (`country`, `user_type`, `subscription_tier`, etc.) are extensions added via `additionalFields` in `apps/api/src/plugins/auth.ts`. |

Cross-schema references (e.g. `bookings.expert_id → experts.id`) are **not** enforced as foreign keys at the DB level — Payload and Drizzle would clash on each other's tables. Referential integrity is enforced at the application layer in Fastify handlers.

---

## First-run setup

### 1. Create a Neon Postgres database

You picked Neon (cloud, free tier).

1. Sign up at [neon.tech](https://neon.tech) (GitHub login works).
2. Create a project: name it `bizbridge`, region `aws-us-east-1` (or closest to you).
3. From the Connection Details panel, copy the **pooled** connection string. It looks like:
   ```
   postgres://USER:PASSWORD@ep-xxx-xxx-pooler.region.aws.neon.tech/bizbridge?sslmode=require
   ```
4. (Optional but recommended) Create two databases: `bizbridge_dev` and `bizbridge_prod`. For Phase 1 a single `bizbridge` is fine.

### 2. Generate secrets

```bash
# Bash / Git Bash on Windows:
openssl rand -hex 32

# PowerShell alternative:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Generate one for `PAYLOAD_SECRET` and one for `BETTER_AUTH_SECRET`.

### 3. Configure `.env`

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Fill the same `DATABASE_URL` (Neon pooled URL) in both files. Fill `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`.

Everything else (Chapa, Stripe, Resend, Cal, R2, Redis) can stay empty until Phase 2/3 — the services throw clear "not configured" errors instead of crashing.

### 4. Install + migrate

```bash
pnpm install
pnpm db:generate          # produces SQL into apps/api/src/db/migrations/
pnpm db:migrate           # applies Drizzle migrations (Better Auth + app tables)
pnpm payload:migrate      # applies Payload migrations (creates content tables in `payload` schema)
pnpm payload:generate-types
```

### 5. Seed the MOR data

```bash
pnpm --filter @bizbridge/web seed:mor
```

Idempotent — re-run whenever `sectors.json`, `categories.ts`, or `authorities.ts` changes. Expected output:
- `sector-categories`: 9 rows
- `business-sectors`: 519 rows
- `sector-license-requirements`: 519 rows (one "Business License" per sector with the issuing authority name)
- `sector-approvals`: ~300 rows (sectors where an upstream ministry must verify competency before the trade licence is issued)

Verify in admin at `/admin/collections/business-sectors`, or via psql:
```sql
SELECT count(*) FROM payload.business_sectors;           -- 519
SELECT count(*) FROM payload.sector_categories;           -- 9
SELECT count(*) FROM payload.sector_license_requirements; -- 519
SELECT count(*) FROM payload.sector_approvals;            -- ~300
```

### 6. Run

```bash
pnpm dev
```

- Marketing site:   http://localhost:3000
- Payload admin:    http://localhost:3000/admin   (first visit creates the initial admin)
- Fastify API:      http://localhost:4000/health

---

## Conventions

- **TypeScript strict everywhere**; no `any` (`tsconfig.base.json` enforces).
- **Zod for boundary validation** — shared schemas in `packages/shared/src/schemas/*`, imported by both apps.
- **Drizzle query builder, no raw SQL** in routes; raw SQL only in migration files.
- **No `SELECT *`** in production routes — explicit columns via `.select({...})`.
- **R2 for files** (never DB blobs, never local FS).
- **Payload for content only** — Payload does NOT own users, payments, or auth. Better Auth owns users; Fastify owns transactional flow.
- **Chapa primary, Stripe secondary** — default to Chapa for ETB; Stripe is the "pay in USD" alternative.
- **Bilingual (en + am)** for sector data — `name_en` always populated, `name_am` optional in Phase 1.
- **Mobile-first Tailwind** (`packages/config/tailwind.preset.cjs` defines brand + Ethiopia palette).

---

## Phase 1 status (skeleton — needs you to run)

| | |
|---|---|
| Monorepo (Turborepo + pnpm) | done |
| `packages/shared` (Zod, constants, access matrix) | done |
| `packages/config` (tsconfig + Tailwind preset) | done |
| `apps/web` Next.js 15 skeleton (marketing, auth, dashboard route groups) | done — placeholder pages, real UI in Phase 2 |
| `apps/web` Payload v3 embedded at `/admin` with 15 collections + 3 globals | done — admin runs after `pnpm install` + migrate |
| `apps/api` Fastify 5 with plugins, services, route stubs | done — all endpoints return 501 with TODO notes |
| Drizzle schema files (Better Auth + 7 app tables) | done |
| Drizzle migration SQL | **TODO: run `pnpm db:generate` after Neon setup** |
| Payload migration SQL | **TODO: run `pnpm payload:migrate` after Neon setup** |
| MOR document parser + extracted JSON | done — 519/519 sectors in `apps/web/src/seed/data/sectors.json` |
| MOR seed script | done — `apps/web/src/seed/mor.ts` (batched: fetch-then-Promise.all chunks of 25, ~30s on Neon vs ~10min row-by-row). Idempotent. |
| Sector browser real UI | **TODO: after seed; lives in `apps/web/src/app/(marketing)/sectors/`** |
| Deploys (Vercel web + Dokploy api) | **TODO: after Phase 1 is functional locally** |

---

## Decisions made / deferred

### Decided (during scaffolding session)

- Payload owns content tables; Drizzle owns transactional tables; one Postgres, two schemas (`payload`, `public`).
- Better Auth uses `additionalFields` to extend the `user` table with `country`, `user_type`, `subscription_tier`, `subscription_status`, `subscription_expires_at`, `phone`, `full_name`.
- Route group for Payload admin is `(cms)` per PROJECT.md (Payload's own template uses `(payload)`, but the group name is cosmetic — the URL stays `/admin`).
- Sector sub-data (license requirements, competency certificates, approvals, costs, steps, documents) are **separate collections** with `relationship` back to `business-sectors`, rather than nested arrays. Reason: makes the MOR seed step in Section 9 much cleaner and lets us query each independently.
- R2 storage is wired through Payload's `@payloadcms/storage-s3` plugin (R2 is S3-compatible). Activates automatically when R2 env vars are present.

## MOR seed: what's in vs. what's deferred

`apps/web/src/seed/data/sectors.json` contains all 519 official sector codes from Directive 17/2011 with `mor_code`, `name_en`, `name_am`, and the concatenated verification-body + licensing-authority abbreviations. `categories.ts` covers the 9 top-level categories. `authorities.ts` registers 36 ministries / authorities and provides `splitEnglishAbbrev()` (longest-prefix match, 100% coverage on the 46 unique combinations found in the source).

Seed populates these collections:

| Collection | Rows | Coverage |
|---|---:|---|
| `sector-categories` | 9 | Complete from Annex 1 |
| `business-sectors` | 519 | Complete from §4 / Annex 1 |
| `sector-license-requirements` | 519 | One "Business License" per sector, issuing authority correctly attributed |
| `sector-approvals` | ~300 | Only when verification body ≠ licensing authority (real upstream ministry approvals) |

Not seeded — out of scope for the structural seed, needs additional source material:

- `sector-costs` — directive doesn't list fee amounts. Source from `etrade.gov.et` or the MOR fee schedule, then write `seed-costs.ts`.
- `sector-competency-certificates` — directive references verification bodies but doesn't enumerate certificate names per sector. Manual content task.
- `sector-steps` — step-by-step process is a manual content task; most sectors follow a similar template (TIN → Investment licence → Bank → Trade licence → Tax registration → sector-specific approvals).
- `sector-documents` — R2 uploads handled in Payload admin.
- `description_full` — left blank; populate from the Amharic explanation PDF or original drafting per sector.

**Known data-quality caveats** (also flagged in `apps/web/src/seed/README.md`):

- English sector names from the PDF are word-glued ("Growingofcereals"). The seed stores them as-is. CamelCase and parens/comma splits are applied automatically. Editors can fix high-value ones in Payload admin without re-running the seed.
- 7 sectors had a code mismatch between the Amharic and English columns of the directive (typos in the source). Both values are preserved in `sectors.json` as `mor_code` and `mor_code_alt`; the Amharic-column code is treated as authoritative.

### Deferred to next session(s)

- **Amharic explanation PDF deep-pass** — pull expanded descriptions per sector for `description_full`. Useful but not blocking.
- **Better Auth client** wiring in `apps/web` — needed for real login/signup pages.
- **Google OAuth** — env vars are listed but provider not configured yet.
- **`packages/ui`** — empty placeholder; will be populated with shadcn/ui components when we build the real sector browser.
- **next-intl wiring** — installed but no `i18n` config yet; Amharic translations are a Phase 4 deliverable per PROJECT.md §15.
- **MeiliSearch / Cal.com / BullMQ workers** — env scaffolded, no implementation; Phase 3+.
- **Pre-commit hooks / CI** — none configured. Recommend adding `lefthook` or `husky` + GitHub Actions running `pnpm typecheck && pnpm lint && pnpm test` once tests exist.

### Open questions for next session

1. **Better Auth user.id type**: Better Auth uses `text` ids (cuid/nanoid). PROJECT.md §4 specifies `uuid PK` for `users`. I chose Better Auth's `text` to avoid fighting the library. If you want uuid everywhere, we'd need a custom id generator config in Better Auth.
2. **Payment idempotency**: webhook handlers will need an idempotency table (or use `payments.provider_transaction_id` as the dedup key). Decide before Phase 2.
3. **Currency precision**: `numeric(12, 2)` for all monetary columns is safe for ETB and USD up to ~10 billion. If we'll show fractional cents anywhere, bump to `(14, 4)`.
4. **Soft-delete vs hard-delete** for user accounts: GDPR-style erase request handling not implemented.

---

## Repo map

```
bizguide/
├── PROJECT.md                         # product + architecture spec
├── CLAUDE.md                          # this file
├── README.md                          # high-level intro
├── package.json                       # workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── docs/mor/                          # MOR Directive 17/2011 source PDFs
├── apps/
│   ├── web/                           # Next.js 15 + Payload v3
│   │   ├── payload.config.ts → src/payload.config.ts
│   │   └── src/
│   │       ├── app/(marketing|auth|dashboard|cms)/...
│   │       ├── payload/
│   │       │   ├── access.ts
│   │       │   ├── collections/*.ts
│   │       │   └── globals/*.ts
│   │       └── payload.config.ts
│   └── api/                           # Fastify + Drizzle
│       ├── drizzle.config.ts
│       └── src/
│           ├── app.ts / server.ts / env.ts
│           ├── plugins/{db,auth,tier-access}.ts
│           ├── services/{chapa,stripe,r2,email,cal}.service.ts
│           ├── routes/{auth,sectors,reports,subscriptions,payments,experts,bookings,checklists,calculator,user}/index.ts
│           └── db/
│               ├── migrate.ts
│               ├── seed.ts
│               ├── schema/{index,enums,auth,payments,subscriptions,bookings,user-report-purchases,user-checklists,expert-reviews}.ts
│               └── migrations/        # generated SQL lands here
└── packages/
    ├── shared/                        # Zod schemas, constants, access matrix
    ├── ui/                            # placeholder
    └── config/                        # tsconfig presets + Tailwind preset
```
