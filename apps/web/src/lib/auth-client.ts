/**
 * Better Auth React client. Points at Next.js's own /api/auth routes — no
 * cross-origin API server needed. Use from Client Components:
 *
 *   const { signIn, signOut, useSession } = authClient
 */
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient
