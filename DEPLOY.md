# Deploy — BizBridge Ethiopia

Vercel + Neon. Everything else is optional.

## What's deployed

Only `apps/web`. It bundles:

- Next 15 marketing site + `/dashboard` + `/sectors` + all tools (`/wizard`, `/calculator`, `/checklist`, `/compare`, `/lookup`, `/suggest`).
- Payload v3 admin at `/admin`, mounted inside Next.
- Better Auth mounted at `/api/auth/*` as a Next route handler.

`apps/api` (Fastify) is **not required** for production. It's kept in the monorepo for future mobile/third-party use; it does not need to be deployed for the free launch.

## Prerequisites

1. **Neon Postgres** — a project with a single database. Copy the pooled connection string (`?sslmode=require` at the end).
2. **Vercel** account with this repo connected.
3. Two `openssl rand -hex 32` secrets — one for Payload, one for Better Auth.

## Vercel env vars

Set these in **Project → Settings → Environment Variables** for the Production environment:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://bizbridge.et` | Prod URL. Used by sitemap.xml, robots.txt, JSON-LD, Better Auth trusted origins. |
| `DATABASE_URL` | Neon pooled URL | Both Payload and Better Auth read from this. |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` | Session encryption for Payload admin. |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` | Auth signing key. |
| `NEXT_PUBLIC_CONSULT_EMAIL` | `cheridemeke777@gmail.com` | Default public email. Optional — falls back to this in code. |
| `NEXT_PUBLIC_CONSULT_TELEGRAM` | `https://t.me/Cherireal7` | Optional fallback. |

**Optional (leave unset to disable):**

- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google OAuth via Better Auth.
- `NEXT_PUBLIC_CONSULT_FORMSUBMIT` — Formsubmit endpoint for the consult form.

## Vercel project settings

- **Root directory:** repo root.
- **Framework preset:** Next.js.
- **Build command:** `pnpm --filter @bizbridge/web build`.
- **Install command:** `pnpm install --frozen-lockfile`.
- **Output directory:** default (`.next`).
- **Node version:** 20.11+.

## First-deploy checklist

1. Push `main` to GitHub.
2. Import the repo in Vercel.
3. Set the env vars above.
4. First build will fail if the DB schema is behind — apply migrations locally against the prod DB *before* deploying:

   ```bash
   cd apps/web
   DATABASE_URL='...prod-url...' echo y | pnpm migrate
   ```

5. Seed sector content once (idempotent):

   ```bash
   cd apps/web
   DATABASE_URL='...prod-url...' pnpm seed:mor
   DATABASE_URL='...prod-url...' pnpm seed:all-bilingual
   DATABASE_URL='...prod-url...' pnpm seed:pilot-bilingual
   ```

6. Redeploy from Vercel dashboard.
7. Visit `https://bizbridge.et/admin`, create the first admin, log in.

## After launch

- Set `NEXT_PUBLIC_APP_URL` to the custom domain the moment you attach it — sitemap.xml falls back to `http://localhost:3000` when the env var is missing, which is wrong for crawlers.
- Any change to `apps/web/src/payload/collections/**` needs a fresh migration file — see the pattern in `apps/web/src/payload/migrations/20260722_*`. Payload's interactive `migrate:create` needs a TTY; hand-writing the migration works too.

## Contact

- Cheri: [`cheridemeke777@gmail.com`](mailto:cheridemeke777@gmail.com) · Telegram [`@Cherireal7`](https://t.me/Cherireal7)
