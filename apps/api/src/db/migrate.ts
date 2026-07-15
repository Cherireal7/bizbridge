import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { env } from '../env.js'

async function main() {
  const client = postgres(env.DATABASE_URL, { max: 1, ssl: 'require' })
  const db = drizzle(client)

  console.log('Running Drizzle migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('Migrations complete.')

  await client.end()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
