/**
 * Pilot bilingual enrichment — updates ~25 diaspora / investor priority
 * sectors with per-code permitted operations in Amharic (source of truth from
 * MOR Directive 17/2011 Explanation Manual) and English (translated for
 * BizBridge). Also fills in legacy MOR codes and refreshes name overrides
 * where the auto-parsed name was ugly.
 *
 *   pnpm seed:pilot-bilingual
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import pilot from './data/sector-pilot-bilingual.json'

type PilotSector = {
  mor_code: string
  name_am?: string
  name_en?: string
  legacy_codes?: string[]
  permitted_operations?: { am: string; en: string }[]
}

async function main() {
  console.log('Booting Payload…')
  const payload = await getPayload({ config: await config })

  const sectors = (pilot as { sectors: PilotSector[] }).sectors
  console.log(`Applying pilot bilingual data to ${sectors.length} sectors…`)

  let updated = 0
  let missing = 0

  for (const entry of sectors) {
    const found = await payload.find({
      collection: 'business-sectors',
      where: { mor_code: { equals: entry.mor_code } },
      limit: 1,
      depth: 0,
    })
    const sector = found.docs[0]
    if (!sector) {
      console.log(`  · ${entry.mor_code}  NOT FOUND — skipped`)
      missing += 1
      continue
    }

    const patch: Record<string, unknown> = {}
    if (entry.name_en && entry.name_en !== sector.name_en) patch.name_en = entry.name_en
    if (entry.name_am && entry.name_am !== sector.name_am) patch.name_am = entry.name_am
    if (entry.legacy_codes && entry.legacy_codes.length > 0) {
      patch.legacy_codes = entry.legacy_codes.map((code) => ({ code }))
    }
    if (entry.permitted_operations && entry.permitted_operations.length > 0) {
      patch.permitted_operations_am = entry.permitted_operations.map((op) => ({ text: op.am }))
      patch.permitted_operations_en = entry.permitted_operations.map((op) => ({ text: op.en }))
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  · ${entry.mor_code}  no diff`)
      continue
    }

    await payload.update({
      collection: 'business-sectors',
      id: sector.id,
      data: patch,
    })
    updated += 1
    console.log(`  ✓ ${entry.mor_code}  ${entry.name_en ?? sector.name_en}`)
  }

  console.log(`\nDone. Updated ${updated}, missing ${missing}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
