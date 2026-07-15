/**
 * Better Auth React client.
 *
 * Points at the Fastify API (apps/api) so signup/login/session calls hit the
 * same auth instance that issues tokens. Use from Client Components only:
 *
 *   const { signIn, signOut, useSession } = authClient
 */

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient
