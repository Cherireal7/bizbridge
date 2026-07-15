# SETUP — first-run guide

This is the "I want to see it running locally" path. Five steps, about 10 minutes once Neon is created.

If you have already done some of these, jump to the right step.

---

## 1. Create a Neon Postgres database (~2 min)

1. Open [console.neon.tech](https://console.neon.tech) and sign in with GitHub.
2. Click **Create a project**.
3. Settings:
   - Project name: `bizbridge`
   - Region: pick the one closest to you (e.g. `aws-eu-central-1` for Europe/Africa, `aws-us-east-1` otherwise)
   - Postgres version: 16 (default)
4. After creation, open the **Connection Details** panel and copy the **Pooled connection** string. It looks like:
   ```
   postgres://USER:PASSWORD@ep-xxx-xxx-pooler.region.aws.neon.tech/bizbridge?sslmode=require
   ```
   Keep this open in a tab — you'll paste it twice.

> Why pooled? Neon's pooled URL handles many short-lived connections cleanly. Payload + Drizzle both work with it. The unpooled URL is fine for migrations but not for high-concurrency dev use.

---

## 2. Generate two secrets (~30 sec)

You need a `PAYLOAD_SECRET` (used to sign Payload's admin cookies) and a `BETTER_AUTH_SECRET` (used to sign Better Auth user sessions). Both must be at least 32 random bytes.

**PowerShell:**
```powershell
[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Git Bash (if you have it):**
```bash
openssl rand -hex 32
```

Run it twice. Copy each output separately.

---

## 3. Fill the `.env` files (~1 min)

```powershell
Copy-Item apps\web\.env.example apps\web\.env
Copy-Item apps\api\.env.example apps\api\.env
```

Open both files in your editor and fill these — leave everything else as-is:

**`apps/web/.env`:**
```ini
DATABASE_URL=postgres://...   # from step 1
PAYLOAD_SECRET=...            # first secret from step 2
BETTER_AUTH_SECRET=...        # second secret from step 2
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`apps/api/.env`:**
```ini
DATABASE_URL=postgres://...   # SAME URL as above
BETTER_AUTH_SECRET=...        # SAME second secret as above
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
```

Chapa, Stripe, Resend, R2, Cal, Redis can stay blank — the services throw clear "not configured" errors if you try to use them, but they don't block boot.

---

## 4. Install + migrate + seed (~5 min total)

```powershell
# from C:\Users\hp\Documents\Github\bizguide

# Install (already done if you ran the setup session — check with `Test-Path node_modules`)
pnpm install

# Generate Drizzle migration SQL from the schema files in apps/api
pnpm db:generate

# Apply Drizzle migrations to Neon (creates Better Auth + payments + subscriptions + bookings + checklists + expert_reviews)
pnpm db:migrate

# Apply Payload migrations to Neon (creates all editorial content tables in the `payload` schema)
pnpm payload:migrate

# Regenerate Payload TypeScript types
pnpm payload:generate-types

# THE SEED — populates 9 categories, 519 sectors, 519 license requirements, ~300 ministry approvals
pnpm --filter @bizbridge/web seed:mor
```

Expected `seed:mor` output:
```
Booting Payload Local API…

[1/3] Upserting 9 categories…
  Categories ready: 9

[2/3] Upserting 519 business sectors…
  Sectors: 519 created, 0 updated, 0 skipped.

[3/3] Upserting license requirements and approvals…
  Licenses created: 519, Approvals created: ~300

✓ MOR seed complete.
```

If you ever change `sectors.json`, `categories.ts`, or `authorities.ts`, re-running `pnpm seed:mor` updates in place (idempotent).

---

## 5. Run

```powershell
pnpm dev
```

This starts Next.js on `:3000` and Fastify on `:4000` in parallel.

Open these in your browser:

| URL | What you see |
|---|---|
| `http://localhost:3000` | Marketing homepage with Bishoftu hero + featured sectors |
| `http://localhost:3000/sectors` | Browse all 519 sectors grouped by category with search + filter |
| `http://localhost:3000/sectors/growingofcereals-11111` | Sector detail page — free overview + premium-gated steps/costs/docs |
| `http://localhost:3000/pricing` | Pricing tiers from Payload `PricingConfig` global |
| `http://localhost:3000/admin` | Payload admin — first visit prompts you to create the initial admin user |
| `http://localhost:4000/health` | Fastify API health check |
| `http://localhost:4000/api/sectors` | API stub (returns 501 until Phase 2 wires it) |

---

## Verifying the seed in the admin panel

1. Open `http://localhost:3000/admin` and create the initial admin user.
2. Sidebar → **Content** → **Business Sectors** → you should see 519 rows.
3. Sidebar → **Content** → **Sector Categories** → 9 rows.
4. Sidebar → **Sector Data** → **Sector License Requirements** → 519 rows.
5. Sidebar → **Sector Data** → **Sector Approvals** → ~300 rows.

Or via psql:
```sql
SELECT count(*) FROM payload.business_sectors;           -- 519
SELECT count(*) FROM payload.sector_categories;           -- 9
SELECT count(*) FROM payload.sector_license_requirements; -- 519
SELECT count(*) FROM payload.sector_approvals;            -- ~300
```

---

## Troubleshooting

**`Error: connect ETIMEDOUT` on migrations** — Neon free tier auto-suspends the database after 5 min idle. The first connection wakes it up; retry once.

**`PAYLOAD_SECRET environment variable is required`** — re-check `apps/web/.env`. The file is gitignored, so it's easy to forget.

**`db:generate` produces no migration files** — check that `apps/api/.env` has `DATABASE_URL`. drizzle-kit reads it via `dotenv/config`.

**Payload admin shows "Database doesn't have any users yet"** — that's expected on first run. Fill the signup form to create the admin.

**Seed says "0 sectors created, 519 updated"** — that means you re-ran it. Idempotent by design; nothing wrong.

**Sector pages show "Loading…" forever** — Payload/`DATABASE_URL` not reachable. Check Neon connection string and that migrations ran.

**`pnpm install` is extremely slow** — that's npm registry latency in your network. You can use `pnpm install --network-concurrency 4` to avoid overwhelming a slow link. Subsequent installs reuse the cached packages.
