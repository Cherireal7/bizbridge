import fp from 'fastify-plugin'
import postgres from 'postgres'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { env } from '../env.js'
import * as schema from '../db/schema/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
  }
}

export const dbPlugin = fp(async (app) => {
  const client = postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === 'production' ? 20 : 5,
    ssl: 'require',
  })
  const db = drizzle(client, { schema })

  app.decorate('db', db)
  app.addHook('onClose', async () => {
    await client.end()
  })
})
