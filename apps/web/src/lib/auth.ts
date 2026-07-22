/**
 * Better Auth server instance — runs directly inside Next.js as an
 * `/api/auth/[...all]` route handler. No separate Fastify service is required
 * for auth. Uses a lightweight pg connection so it doesn't conflict with
 * Payload's Drizzle pool.
 */
import 'server-only'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './auth-schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required for Better Auth. Set it in .env or your Vercel environment.',
  )
}

const pool = new Pool({ connectionString })
const db = drizzle(pool, { schema })

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh once/day
  },
  user: {
    additionalFields: {
      fullName: { type: 'string', required: false },
      phone: { type: 'string', required: false },
      country: { type: 'string', required: false },
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ],
})
