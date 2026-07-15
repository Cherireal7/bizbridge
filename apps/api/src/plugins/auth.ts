import fp from 'fastify-plugin'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { env } from '../env.js'
import * as schema from '../db/schema/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    auth: ReturnType<typeof createAuth>
  }
  interface FastifyRequest {
    user: { id: string; email: string; subscription_tier: 'free' | 'basic' | 'pro' } | null
  }
}

function createAuth(db: ReturnType<typeof drizzleAdapter>) {
  return betterAuth({
    database: db,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    user: {
      additionalFields: {
        country: { type: 'string', required: false },
        user_type: { type: 'string', required: false, defaultValue: 'local' },
        subscription_tier: { type: 'string', required: false, defaultValue: 'free' },
        subscription_status: { type: 'string', required: false, defaultValue: 'inactive' },
        subscription_expires_at: { type: 'date', required: false },
        phone: { type: 'string', required: false },
        full_name: { type: 'string', required: false },
      },
    },
  })
}

export const authPlugin = fp(async (app) => {
  const adapter = drizzleAdapter(app.db, { provider: 'pg', schema })
  const auth = createAuth(adapter)
  app.decorate('auth', auth)

  app.decorateRequest('user', null)

  app.addHook('preHandler', async (request) => {
    const session = await auth.api.getSession({ headers: request.headers as unknown as Headers })
    if (session?.user) {
      request.user = {
        id: session.user.id,
        email: session.user.email,
        subscription_tier:
          (session.user as { subscription_tier?: 'free' | 'basic' | 'pro' }).subscription_tier ?? 'free',
      }
    }
  })
})
