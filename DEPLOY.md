# DEPLOY

Hand-off notes for the person deploying BizBridge Ethiopia on a VPS.

## What you're deploying

- **Next.js 15** app with **Payload CMS v3** embedded (admin at `/admin`).
- Postgres lives on **Neon** (managed, external) — no DB to run on the VPS.
- **Fastify API** in `apps/api` is not deployed for now (accounts/paywall are
  hidden by feature flag).

## Requirements on the VPS

- Ubuntu 22.04 or 24.04 (any Linux with Docker works)
- 2 vCPU · 2 GB RAM minimum (4 GB comfortable — Next build peaks ~2 GB)
- 10 GB disk
- Docker + Docker Compose
- A reverse proxy for TLS: Caddy (easiest), nginx, or Traefik
- A domain (or subdomain) pointed at the VPS

## Step 1 — Install Docker + Caddy (once)

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER" && newgrp docker

# Caddy — auto-HTTPS reverse proxy
sudo apt update && sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

## Step 2 — Get the code

```bash
git clone https://github.com/Cherireal7/bizbridge.git /opt/bizbridge
cd /opt/bizbridge
```

## Step 3 — Environment file

Create `/opt/bizbridge/.env.production` with these five vars:

```env
DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-XXXX-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PAYLOAD_SECRET=64-hex-char-string
BETTER_AUTH_SECRET=64-hex-char-string
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Cheri will hand you the actual `DATABASE_URL` and secrets separately. Generate
random secrets locally if needed:

```bash
openssl rand -hex 32
```

Do **not** commit this file. `.env.production` is already covered by
`.dockerignore` and `.gitignore`.

## Step 4 — Build + run

```bash
cd /opt/bizbridge
docker compose build
docker compose up -d
docker compose logs -f web    # watch it boot; wait for "Ready in Xms"
```

The container listens on `127.0.0.1:3000` (localhost only) — Caddy proxies
`:443` in front of it.

## Step 5 — Caddy reverse proxy + auto-TLS

Edit `/etc/caddy/Caddyfile`:

```caddy
your-domain.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

Then:

```bash
sudo systemctl reload caddy
```

Caddy auto-provisions Let's Encrypt certs on first hit — takes ~30 seconds.

## Step 6 — First-run DB migration + seed (once)

The Neon DB Cheri hands you is already migrated and seeded. **Skip this step
unless you're deploying against a fresh Neon branch.**

If against a fresh DB:

```bash
docker compose run --rm web sh -c "cd /app && node apps/web/node_modules/payload/dist/bin.js migrate"
# then seed the 519 MOR sectors:
docker compose run --rm web sh -c "cd /app && node apps/web/dist/seed/mor.js"
```

## Step 7 — Verify

```bash
curl -I https://your-domain.com/                              # 200
curl -I https://your-domain.com/sectors                       # 200
curl -I https://your-domain.com/login                         # 404 (accounts hidden by design)
```

Open the site in a browser. Homepage, `/sectors`, `/services`, `/consult` all
render. `/admin` is Payload's CMS (first visit creates the admin user).

## Updates

```bash
cd /opt/bizbridge
git pull
docker compose build web
docker compose up -d
```

Rolling deploy — container restarts, ~5–10 s of downtime.

## Troubleshooting

- **`Ready in Xms` never appears** → check `docker compose logs web`. Usually
  a missing env var or DNS-unreachable `DATABASE_URL`.
- **Homepage returns 200 but no sector data** → Neon compute is suspended;
  the first request wakes it (~500 ms), subsequent requests are fast. If it
  never wakes, DB URL is stale — get a fresh one from Neon.
- **Payload boot OOM** on smaller VPS → the build step needs ~2 GB RAM. Run
  `docker compose build` on a workstation instead and push the image to a
  registry, then `docker pull` on the VPS.

## What's not covered here

- **Domain / DNS** — you'll set an A record pointing your domain at the VPS's
  public IP. That's on you / whoever owns the DNS.
- **Backups** — Neon handles DB backups (point-in-time restore). Nothing to
  back up on the VPS itself (stateless container).
- **CI/CD** — no pipeline yet. Deploys are manual `git pull` + rebuild for
  now.
- **Fastify API (`apps/api`)** — not deployed. Only becomes relevant when
  accounts are re-enabled (flip `NEXT_PUBLIC_ENABLE_ACCOUNTS=true`).
- **Cloudflare R2** for uploads — not wired. Media collection works locally
  but production uploads need R2 env vars set + volume mount for local
  fallback. Ask Cheri if you need it.

## Contact

Cheri: `cheridemeke7@gmail.com` · Telegram `@Cherireal7`
