/**
 * One-shot: apply cleaned name_en (via humanizeSectorName) and cleaned name_am
 * (from the MoR Explanation Manual parse — properly spaced Ge'ez) to every
 * BusinessSectors row. Idempotent: only writes when the field would actually
 * change.
 *
 *   pnpm seed:fix-names
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { humanizeSectorName } from '../lib/humanize-sector-name'
import explanations from './data/sector-explanations.json' with { type: 'json' }

async function main() {
  console.log('Booting Payload…')
  const payload = await getPayload({ config: await config })

  const byCode = (explanations as {
    byCode: Record<string, { name_am?: string } | undefined>
  }).byCode

  const all = await payload.find({
    collection: 'business-sectors',
    limit: 1000,
    depth: 0,
  })
  console.log(`Scanning ${all.docs.length} sectors…`)

  let renamed_en = 0
  let renamed_am = 0
  let unchanged = 0

  for (const sector of all.docs) {
    const currentEn = sector.name_en
    const currentAm = sector.name_am ?? null

    const newEn = humanizeSectorName(sector.mor_code, currentEn)
    const explainAm = byCode[sector.mor_code]?.name_am ?? null
    // Prefer the Explanation-Manual's Amharic (proper spacing) whenever present
    // and different from the current DB value.
    const newAm = explainAm && explainAm.length > 0 ? explainAm : currentAm

    const patch: Record<string, string> = {}
    if (newEn && newEn !== currentEn) {
      patch.name_en = newEn
      renamed_en += 1
    }
    if (newAm && newAm !== currentAm) {
      patch.name_am = newAm
      renamed_am += 1
    }

    if (Object.keys(patch).length === 0) {
      unchanged += 1
      continue
    }

    await payload.update({
      collection: 'business-sectors',
      id: sector.id,
      data: patch,
    })
  }

  console.log(`\nDone. Renamed EN=${renamed_en}, AM=${renamed_am}, unchanged=${unchanged}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
