/**
 * MOR Directive 17/2011 seed — batch version.
 *
 * Strategy: fetch existing rows for each collection in 1-3 paginated calls,
 * compute the diff, and issue creates/updates in chunked Promise.all batches.
 * Avoids the row-by-row find-then-upsert pattern that round-trips per sector
 * (which on Neon @ ~200ms RTT took ~10 minutes for the first run).
 *
 * Idempotent. Safe to re-run after a partial failure (resumes where it left off).
 *
 *   pnpm seed:mor
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import sectorsData from './data/sectors.json'
import { CATEGORIES, categoryForMorCode } from './data/categories'
import { splitEnglishAbbrev, AUTHORITIES } from './data/authorities'

const PARALLEL = 25 // concurrent writes per chunk against Neon
const FETCH_LIMIT = 2000 // single-page pagination cap for existing-row scan

type RawSector = {
  serial: number
  serial_repeat: number
  mor_code: string
  mor_code_alt: string | null
  name_am: string
  name_en: string
  verif_lic_am: string
  verif_lic_en: string
}

type AnyId = number

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'sector'
  )
}

function shortDescription(name_en: string): string {
  return `Opening a ${name_en.toLowerCase()} business in Ethiopia. This guide covers the official MOR licensing category, permitted operations under the license (Amharic + English), required ministry approvals, certificates of competency, fees, and step-by-step setup — always free.`
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
  console.log('Booting Payload Local API…')
  const payload = await getPayload({ config: await config })

  // ─── 1. CATEGORIES ──────────────────────────────────────────────────────────
  console.log(`\n[1/3] Upserting ${CATEGORIES.length} categories…`)
  const catsExisting = await payload.find({
    collection: 'sector-categories',
    limit: 100,
  })
  const catBySlug = new Map<string, AnyId>(catsExisting.docs.map((c) => [c.slug, c.id]))

  const categoryIdByPrefix = new Map<string, AnyId>()
  let catsCreated = 0
  let catsUpdated = 0

  for (const cat of CATEGORIES) {
    const existingId = catBySlug.get(cat.slug)
    const fields = {
      name_en: cat.name_en,
      name_am: cat.name_am,
      icon: cat.icon,
      sort_order: cat.sort_order,
    }
    if (existingId) {
      await payload.update({ collection: 'sector-categories', id: existingId, data: fields })
      categoryIdByPrefix.set(cat.mor_prefix, existingId)
      catsUpdated++
    } else {
      const doc = await payload.create({
        collection: 'sector-categories',
        data: { slug: cat.slug, ...fields },
      })
      categoryIdByPrefix.set(cat.mor_prefix, doc.id)
      catsCreated++
    }
  }
  console.log(`  Categories: ${catsCreated} created, ${catsUpdated} updated.`)

  // ─── 2. SECTORS ─────────────────────────────────────────────────────────────
  const sectors = sectorsData as RawSector[]
  console.log(`\n[2/3] Upserting ${sectors.length} business sectors…`)

  // One paginated fetch of every existing sector → mor_code → id map
  const sectorByMor = new Map<string, AnyId>()
  let page = 1
  while (true) {
    const res = await payload.find({
      collection: 'business-sectors',
      limit: FETCH_LIMIT,
      page,
      depth: 0,
    })
    for (const s of res.docs) sectorByMor.set(s.mor_code, s.id)
    if (page >= res.totalPages) break
    page++
  }
  console.log(`  Existing sectors fetched: ${sectorByMor.size}`)

  const toCreate: RawSector[] = []
  const toUpdate: RawSector[] = []
  let skippedNoCat = 0

  for (const s of sectors) {
    if (!categoryForMorCode(s.mor_code)) {
      skippedNoCat++
      continue
    }
    if (sectorByMor.has(s.mor_code)) toUpdate.push(s)
    else toCreate.push(s)
  }
  console.log(`  Plan: ${toCreate.length} create, ${toUpdate.length} update, ${skippedNoCat} skip.`)

  await chunkedMap(toCreate, PARALLEL, async (s) => {
    const cat = categoryForMorCode(s.mor_code)!
    const categoryId = categoryIdByPrefix.get(cat.mor_prefix)
    if (!categoryId) return
    const doc = await payload.create({
      collection: 'business-sectors',
      data: {
        mor_code: s.mor_code,
        name_en: s.name_en,
        name_am: s.name_am,
        slug: `${slugify(s.name_en)}-${s.mor_code}`,
        category: categoryId,
        description_short: shortDescription(s.name_en),
        is_featured: false,
        is_active: true,
      },
    })
    sectorByMor.set(s.mor_code, doc.id)
  })

  // Only update if there are NEW values to push. Skip updates entirely when
  // re-running on already-seeded data — the sector content doesn't change between
  // re-runs unless you edit `sectors.json` or `categories.ts`.
  // (Toggle this if you want forced updates.)
  const FORCE_SECTOR_UPDATE = false
  if (FORCE_SECTOR_UPDATE) {
    await chunkedMap(toUpdate, PARALLEL, async (s) => {
      const id = sectorByMor.get(s.mor_code)!
      const cat = categoryForMorCode(s.mor_code)!
      const categoryId = categoryIdByPrefix.get(cat.mor_prefix)
      if (!categoryId) return
      await payload.update({
        collection: 'business-sectors',
        id,
        data: {
          name_en: s.name_en,
          name_am: s.name_am,
          category: categoryId,
          description_short: shortDescription(s.name_en),
        },
      })
    })
    console.log(`  Sectors: ${toCreate.length} created, ${toUpdate.length} updated.`)
  } else {
    console.log(`  Sectors: ${toCreate.length} created, ${toUpdate.length} unchanged (skip-update mode).`)
  }

  // ─── 3. LICENSES + APPROVALS ────────────────────────────────────────────────
  console.log(`\n[3/3] Upserting license requirements and approvals…`)

  // Fetch existing licenses → key by (sector_id, license_type)
  const existingLicenseKey = new Set<string>()
  page = 1
  while (true) {
    const res = await payload.find({
      collection: 'sector-license-requirements',
      limit: FETCH_LIMIT,
      page,
      depth: 0,
    })
    for (const l of res.docs) {
      const sid = typeof l.sector === 'object' && l.sector ? l.sector.id : l.sector
      existingLicenseKey.add(`${String(sid)}|${l.license_type}`)
    }
    if (page >= res.totalPages) break
    page++
  }

  // Fetch existing approvals → key by (sector_id, approving_ministry)
  const existingApprovalKey = new Set<string>()
  page = 1
  while (true) {
    const res = await payload.find({
      collection: 'sector-approvals',
      limit: FETCH_LIMIT,
      page,
      depth: 0,
    })
    for (const a of res.docs) {
      const sid = typeof a.sector === 'object' && a.sector ? a.sector.id : a.sector
      existingApprovalKey.add(`${String(sid)}|${a.approving_ministry}`)
    }
    if (page >= res.totalPages) break
    page++
  }
  console.log(
    `  Existing licenses: ${existingLicenseKey.size}, approvals: ${existingApprovalKey.size}`,
  )

  type LicenseWrite = {
    sectorId: AnyId
    morCode: string
    licAuth: NonNullable<ReturnType<typeof splitEnglishAbbrev>[1]>
  }
  type ApprovalWrite = {
    sectorId: AnyId
    morCode: string
    verifAuth: NonNullable<ReturnType<typeof splitEnglishAbbrev>[0]>
    licAuth: ReturnType<typeof splitEnglishAbbrev>[1]
  }

  const licensesToCreate: LicenseWrite[] = []
  const approvalsToCreate: ApprovalWrite[] = []

  for (const s of sectors) {
    const sectorId = sectorByMor.get(s.mor_code)
    if (!sectorId) continue
    const [verifAuth, licAuth] = splitEnglishAbbrev(s.verif_lic_en)

    if (licAuth) {
      const key = `${String(sectorId)}|Business License`
      if (!existingLicenseKey.has(key)) {
        licensesToCreate.push({ sectorId, morCode: s.mor_code, licAuth })
      }
    }

    if (verifAuth && verifAuth.code !== (licAuth?.code ?? '')) {
      const key = `${String(sectorId)}|${verifAuth.name_en}`
      if (!existingApprovalKey.has(key)) {
        approvalsToCreate.push({ sectorId, morCode: s.mor_code, verifAuth, licAuth })
      }
    }
  }
  console.log(
    `  Plan: ${licensesToCreate.length} licenses, ${approvalsToCreate.length} approvals to create.`,
  )

  await chunkedMap(licensesToCreate, PARALLEL, async (w) => {
    await payload.create({
      collection: 'sector-license-requirements',
      data: {
        sector: w.sectorId,
        license_type: 'Business License',
        issuing_authority: w.licAuth.name_en,
        is_required: true,
        notes: `MOR Directive 17/2011, sector code ${w.morCode}. Issuing body: ${w.licAuth.name_en} (${w.licAuth.short_am}).`,
      },
    })
  })

  await chunkedMap(approvalsToCreate, PARALLEL, async (w) => {
    await payload.create({
      collection: 'sector-approvals',
      data: {
        sector: w.sectorId,
        approval_name: 'Competency / sector approval',
        approving_ministry: w.verifAuth.name_en,
        sequence_order: 1,
        is_required: true,
        notes: `MOR Directive 17/2011 designates ${w.verifAuth.name_en} (${w.verifAuth.short_am}) as the verification body for sector ${w.morCode}. Obtain this approval before applying for the trade license at ${w.licAuth?.name_en ?? 'the licensing authority'}.`,
      },
    })
  })
  console.log(`  Created: ${licensesToCreate.length} licenses, ${approvalsToCreate.length} approvals.`)

  console.log(`\n✓ MOR seed complete.`)
  console.log(
    `  Categories: ${CATEGORIES.length} | Sectors: ${sectors.length} | Authorities: ${AUTHORITIES.length}`,
  )

  process.exit(0)
}

main().catch((err) => {
  console.error('MOR seed failed:', err)
  process.exit(1)
})
