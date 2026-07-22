/**
 * Bulk seed: for every one of the 519 sectors, apply the properly-spaced
 * Amharic `name_am` and the full `operations_am` array (with legacy codes)
 * from the parsed MOR Explanation Manual. Also cleans column-bleed artifacts
 * from the Amharic text (embedded 5-digit MOR codes that leaked in from the
 * adjacent column during PDF extraction).
 *
 * English translations are NOT populated here — the 27 hand-curated ones from
 * pilot-bilingual.ts are the source of truth. This script explicitly does not
 * overwrite `permitted_operations_en` when it's already populated. Sectors
 * without an English translation render with a "translation pending" note on
 * the detail page.
 *
 *   pnpm seed:all-bilingual
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { humanizeSectorName } from '../lib/humanize-sector-name'
import explanations from './data/sector-explanations.json' with { type: 'json' }
import recovered from './data/sector-explanations-recovered.json' with { type: 'json' }

function slugify(name: string, morCode: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base || 'sector'}-${morCode}`
}

type Explanation = {
  serial: number
  mor_code: string
  name_am: string
  legacy_codes: string[]
  operations_am: string[]
}

// Strip 5-digit MOR code numbers that bled into the operations column from
// the adjacent legacy-codes column during PDF extraction.
function cleanOp(op: string): string {
  return op
    // Remove standalone 5-digit codes (with optional Amharic/ASCII commas around)
    .replace(/\b\d{4,6}[፣,]?\s*\b\d{4,6}\b/g, '')
    .replace(/\b\d{5,6}\b/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([፣,])\s*/g, '$1 ')
    .replace(/\s*(::|፡፡|፡)\s*$/, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

async function chunkedMap<T, R>(
  items: T[],
  size: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size)
    const out = await Promise.all(chunk.map((item, j) => fn(item, i + j)))
    results.push(...out)
  }
  return results
}

async function main() {
  console.log('Booting Payload…')
  const payload = await getPayload({ config: await config })

  const byCode: Record<string, Explanation | undefined> = {
    ...(explanations as { byCode: Record<string, Explanation | undefined> }).byCode,
  }
  // Merge in the fuzzy-recovered rows (28 sectors whose codes drift between
  // the two source PDFs). These use the sector's original mor_code so the
  // lookup in the main loop hits them directly.
  for (const r of (recovered as {
    recovered: Array<{
      original_code: string
      name_am: string
      legacy_codes: string[]
      operations_am: string[]
    }>
  }).recovered) {
    if (!byCode[r.original_code]) {
      byCode[r.original_code] = {
        serial: 0,
        mor_code: r.original_code,
        name_am: r.name_am,
        legacy_codes: r.legacy_codes,
        operations_am: r.operations_am,
      }
    }
  }

  const all = await payload.find({
    collection: 'business-sectors',
    limit: 1000,
    depth: 0,
  })

  console.log(`Applying bulk bilingual seed to ${all.docs.length} sectors…`)

  let updated = 0
  let skipped = 0
  let missingExplanation = 0
  let renamedEn = 0
  let failed = 0

  const tasks = all.docs
    .map((sector) => {
      const entry = byCode[sector.mor_code]
      if (!entry) {
        missingExplanation += 1
        return null
      }

      const cleanedOps = (entry.operations_am ?? [])
        .map(cleanOp)
        .filter((o) => o.length > 0)

      const patch: Record<string, unknown> = {}

      const humanized = humanizeSectorName(sector.mor_code, sector.name_en)
      if (humanized && humanized !== sector.name_en) {
        patch.name_en = humanized
        renamedEn += 1
      }

      const nameForSlug = (patch.name_en as string | undefined) ?? sector.name_en
      const desiredSlug = slugify(nameForSlug, sector.mor_code)
      if (desiredSlug !== sector.slug) {
        patch.slug = desiredSlug
      }

      if (entry.name_am && entry.name_am !== sector.name_am) {
        patch.name_am = entry.name_am
      }

      if (entry.legacy_codes && entry.legacy_codes.length > 0) {
        patch.legacy_codes = entry.legacy_codes.map((code) => ({ code }))
      }

      if (cleanedOps.length > 0) {
        patch.permitted_operations_am = cleanedOps.map((text) => ({ text }))
      }

      // English operations — DO NOT touch (leave whatever pilot-bilingual set).

      if (Object.keys(patch).length === 0) {
        skipped += 1
        return null
      }
      return { sector, patch }
    })
    .filter((t): t is { sector: (typeof all.docs)[number]; patch: Record<string, unknown> } => Boolean(t))

  console.log(`Writing ${tasks.length} updates in parallel chunks of 15…`)

  await chunkedMap(tasks, 15, async ({ sector, patch }) => {
    try {
      await payload.update({
        collection: 'business-sectors',
        id: sector.id,
        data: patch,
      })
      updated += 1
      if (updated % 50 === 0) console.log(`  · ${updated} sectors updated…`)
    } catch (err) {
      failed += 1
      console.error(`  ! ${sector.mor_code}`, (err as Error).message)
    }
  })

  console.log(
    `\nDone. updated=${updated}, name_en_fixed=${renamedEn}, skipped=${skipped}, ` +
      `missing_explanation=${missingExplanation}, failed=${failed}`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
