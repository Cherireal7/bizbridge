/**
 * Server-side user/session resolution.
 *
 * Reads the Better Auth session cookie set by the Fastify API and returns the
 * authenticated user's subscription tier. Used by Server Components to decide
 * what content to render before HTML is sent — critical for tier-gating that
 * survives "view source".
 *
 * Phase 1: returns 'free' for everyone (auth not wired in apps/web yet).
 * Phase 2: replace with a real cookie read against /api/auth/session.
 */

import 'server-only'
import { cookies } from 'next/headers'
import type { SubscriptionTier } from '@bizbridge/shared'

export interface CurrentUser {
  id: string
  email: string
  tier: SubscriptionTier
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return null

  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('better-auth.session_token')
    if (!sessionCookie) return null

    const res = await fetch(`${apiUrl}/api/user/me`, {
      headers: { cookie: `${sessionCookie.name}=${sessionCookie.value}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const user = (await res.json()) as CurrentUser
    return user
  } catch {
    return null
  }
}

export async function getCurrentUserTier(): Promise<SubscriptionTier> {
  const user = await getCurrentUser()
  return user?.tier ?? 'free'
}
