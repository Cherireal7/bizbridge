/**
 * Server-only Payload Local API helper.
 *
 * Wraps `getPayload({ config })` with a per-process cache so a single Next.js
 * server process reuses the Payload instance across requests instead of paying
 * the boot cost every render.
 *
 * Never import from a Client Component — `getPayloadClient()` opens a DB pool.
 */

import 'server-only'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'

let cached: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}

/**
 * Best-effort wrapper. If Payload isn't reachable (DB not configured, migrations
 * not applied, sectors not seeded), returns `null` so the calling page can show
 * an empty/onboarding state instead of crashing the entire route.
 */
export async function tryPayload<T>(
  fn: (payload: Payload) => Promise<T>,
): Promise<T | null> {
  try {
    const payload = await getPayloadClient()
    return await fn(payload)
  } catch (err) {
    // Always log — silent failure hid production issues at launch. Filter noise
    // by keying on "connect" / "ECONNREFUSED" if this gets too chatty later.
    console.warn('[payload] query failed:', (err as Error).message)
    return null
  }
}
