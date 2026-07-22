# Self-host — BizBridge Ethiopia

Deploy on your own server behind Nginx. Target: `bizbridge.doxaplc.com` (or any subdomain).

The DB stays on Neon; only Next.js runs on your box.

## Prereqs on the server

- Node 20.11+ (`node -v`)
- `pnpm` 11+ (`npm i -g pnpm`)
- Nginx already running (you have this)
- Certbot for Let's Encrypt (`sudo apt install certbot python3-certbot-nginx`)
- `pm2` for process supervision (`npm i -g pm2`)

## 1. Clone + install

```bash
cd /var/www
sudo git clone https://github.com/Cherireal7/bizbridge.git bizbridge
cd bizbridge
pnpm install --frozen-lockfile --config.strict-dep-builds=false
```

## 2. Env vars

Create `apps/web/.env.production.local`. Same 4 required vars as Vercel:

```env
NEXT_PUBLIC_APP_URL=https://bizbridge.doxaplc.com
DATABASE_URL=<your Neon pooled URL>
PAYLOAD_SECRET=<openssl rand -hex 32>
BETTER_AUTH_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_CONSULT_EMAIL=cheridemeke777@gmail.com
NEXT_PUBLIC_CONSULT_TELEGRAM=https://t.me/Cherireal7
```

You already have this file locally at `apps/web/.env.production.local` — `scp` it up rather than retyping. **Do not commit it.**

## 3. Build

```bash
cd /var/www/bizbridge
pnpm --filter @bizbridge/web build
```

Takes ~3-5 minutes. Output at `apps/web/.next/`.

## 4. Run with pm2

```bash
cd /var/www/bizbridge/apps/web
pm2 start pnpm --name bizbridge -- start
pm2 save
pm2 startup   # follow the printed sudo command so it auto-starts on reboot
```

Verify it's up locally:

```bash
curl -sI http://localhost:3000 | head -1
# Expect: HTTP/1.1 200 OK
```

## 5. Nginx site

Create `/etc/nginx/sites-available/bizbridge.doxaplc.com`:

```nginx
server {
  listen 80;
  server_name bizbridge.doxaplc.com;

  # Large uploads for the /admin PDF/image manager
  client_max_body_size 20M;

  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Upgrade           $http_upgrade;
    proxy_set_header   Connection        "upgrade";
    proxy_read_timeout 60s;
  }
}
```

Enable + reload:

```bash
sudo ln -s /etc/nginx/sites-available/bizbridge.doxaplc.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. DNS

At your DNS provider for `doxaplc.com`, add:

| Type | Name | Value |
|---|---|---|
| A | `bizbridge` | your server's public IPv4 |

Wait for propagation (~1-5 min). Test:

```bash
dig +short bizbridge.doxaplc.com
```

## 7. HTTPS

```bash
sudo certbot --nginx -d bizbridge.doxaplc.com
```

Follow prompts. Certbot rewrites the nginx block to add `listen 443 ssl;` + redirect.

## 8. First admin

Open https://bizbridge.doxaplc.com/admin — Payload prompts you to create the first admin user.

## Updating (any time you push to main)

```bash
cd /var/www/bizbridge
git pull origin main
pnpm install --frozen-lockfile --config.strict-dep-builds=false
pnpm --filter @bizbridge/web build
pm2 restart bizbridge
```

If a Payload collection changed, apply pending migrations first:

```bash
cd /var/www/bizbridge/apps/web
echo y | pnpm migrate
```

## Media uploads (Payload admin)

Uploaded files go to `apps/web/public` by default (works out of the box on a single-server deploy — no S3 needed). If you later run multiple app instances or want CDN caching, plug an S3-compatible bucket via `@payloadcms/storage-s3` — the plugin is already wired in `payload.config.ts` and activates when `S3_*` env vars are set.

## Troubleshooting

- **502 Bad Gateway** — pnpm start crashed. `pm2 logs bizbridge` and check the stack.
- **500 on every page** — probably DB env vars missing. `pm2 env 0 | grep DATABASE_URL` to confirm the env file was loaded.
- **Amharic looks broken** — server needs the `Noto Sans Ethiopic` font (`sudo apt install fonts-noto-cjk fonts-noto`) OR it's fine since `next/font/google` fetches at build; check the built asset in browser devtools.
- **/admin blank white screen** — usually a Payload cold-start on first request; wait 5-10s and retry.
