# BizBridge Ethiopia

An independent civic-tech project — every MOR sector, every fee, every ministry approval, free to browse. Built for Addis and Bishoftu, applicable across Oromia and federal Ethiopia.

> Read [`PROJECT.md`](./PROJECT.md) for the full product spec and architecture, [`SETUP.md`](./SETUP.md) for first-run setup.

## Stack

Turborepo · Next.js 15 · Payload CMS v3 · Fastify · PostgreSQL (Neon) · Drizzle · Better Auth · Chapa · Cloudflare R2

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
