# BizBridge Ethiopia

Freemium business intelligence and setup platform for opening a business in Bishoftu/Debrezeit, Ethiopia (expanding to other Ethiopian cities).

> Read [`PROJECT.md`](./PROJECT.md) for the full product, architecture, and phase plan.
> Read [`CLAUDE.md`](./CLAUDE.md) for developer commands and conventions.

## Stack

Turborepo · Next.js 15 · Payload CMS v3 · Fastify · PostgreSQL · Drizzle · Better Auth · Chapa + Stripe · Cloudflare R2 · Resend · MeiliSearch · Cal.com

## Workspace

```
apps/
  web/        # Next.js 15 + Payload CMS v3 (embedded admin)
  api/        # Fastify + Drizzle ORM
packages/
  shared/     # Zod schemas, constants, types
  ui/         # Shared React components
  config/     # tsconfig / eslint / tailwind presets
docs/
  mor/        # Ministry of Revenue source documents
```

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
# Fill DATABASE_URL with your Neon connection string in both .env files
pnpm db:generate         # Generate Drizzle migration SQL
pnpm db:migrate          # Apply Drizzle migrations
pnpm payload:migrate     # Apply Payload migrations
pnpm dev                 # Run web + api in parallel
```
