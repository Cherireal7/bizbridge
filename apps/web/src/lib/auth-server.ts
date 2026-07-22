import 'server-only'
import { headers } from 'next/headers'
import { auth } from './auth'

export interface CurrentUser {
  id: string
  email: string
  name?: string | null
}

/**
 * Read the current session from Better Auth on the server. Safe to call from
 * Server Components — returns null if unauthenticated or on any error.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs })
    if (!session?.user) return null
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
    }
  } catch {
    return null
  }
}
