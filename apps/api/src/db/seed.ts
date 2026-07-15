/**
 * Seed script entry point.
 *
 * Phase 1 (Section 9 of PROJECT.md):
 *   - Parse `docs/mor/MOR-Directive-17-2011-Revision-2.pdf` and the Amharic explanation
 *   - Populate Payload collections via the Local API:
 *       sector-categories
 *       business-sectors
 *       sector-license-requirements
 *       sector-competency-certificates
 *       sector-approvals
 *       sector-costs
 *   - Flag any missing/uncertain fields with `// TODO: verify from MOR`
 *
 * Implementation lives at apps/web because Payload's Local API runs inside the Next.js app.
 * This file is a placeholder; the actual seed will likely be:
 *   pnpm --filter @bizbridge/web tsx src/seed/mor.ts
 *
 * For now this script seeds nothing for Drizzle-owned tables (payments, subscriptions, bookings
 * are user-generated; no seed data needed in Phase 1).
 */

async function main() {
  console.log('Drizzle seed: nothing to seed in Phase 1.')
  console.log('To seed Payload content from MOR documents, run the Payload seed (see Section 9 of PROJECT.md).')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
