import { z } from 'zod'
import { TIERS } from '../constants.js'

export const tierSchema = z.enum(TIERS)

export const sectorCategorySchema = z.object({
  id: z.string().uuid(),
  name_en: z.string(),
  name_am: z.string().nullable(),
  slug: z.string(),
  icon: z.string().nullable(),
  sort_order: z.number().int(),
})
export type SectorCategory = z.infer<typeof sectorCategorySchema>

export const sectorListItemSchema = z.object({
  id: z.string().uuid(),
  mor_code: z.string(),
  slug: z.string(),
  name_en: z.string(),
  name_am: z.string().nullable(),
  description_short: z.string(),
  category: sectorCategorySchema.nullable(),
  is_featured: z.boolean(),
})
export type SectorListItem = z.infer<typeof sectorListItemSchema>

export const sectorLicenseRequirementSchema = z.object({
  id: z.string().uuid(),
  license_type: z.string(),
  issuing_authority: z.string(),
  is_required: z.boolean(),
  notes: z.string().nullable(),
})

export const sectorCompetencyCertificateSchema = z.object({
  id: z.string().uuid(),
  certificate_name: z.string(),
  issuing_body: z.string(),
  is_mandatory: z.boolean(),
  description: z.string().nullable(),
  processing_days_min: z.number().int().nullable(),
  processing_days_max: z.number().int().nullable(),
})

export const sectorApprovalSchema = z.object({
  id: z.string().uuid(),
  approval_name: z.string(),
  approving_ministry: z.string(),
  sequence_order: z.number().int(),
  processing_days_min: z.number().int().nullable(),
  processing_days_max: z.number().int().nullable(),
  is_required: z.boolean(),
  notes: z.string().nullable(),
})

export const sectorCostSchema = z.object({
  id: z.string().uuid(),
  cost_item: z.string(),
  amount_birr_min: z.string().nullable(),
  amount_birr_max: z.string().nullable(),
  amount_usd_min: z.string().nullable(),
  amount_usd_max: z.string().nullable(),
  is_official_fee: z.boolean(),
  notes: z.string().nullable(),
  last_verified_at: z.string().datetime().nullable(),
})

export const sectorStepSchema = z.object({
  id: z.string().uuid(),
  step_number: z.number().int(),
  title: z.string(),
  description: z.string(),
  where_to_go: z.string().nullable(),
  documents_needed: z.array(z.string()),
  estimated_days: z.number().int().nullable(),
  tier_required: tierSchema,
})

export const sectorDocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  file_url: z.string().url(),
  file_type: z.enum(['pdf', 'docx', 'xlsx']),
  tier_required: tierSchema,
  download_count: z.number().int(),
})

export const sectorFullSchema = sectorListItemSchema.extend({
  description_full: z.string(),
  license_requirements: z.array(sectorLicenseRequirementSchema),
  competency_certificates: z.array(sectorCompetencyCertificateSchema),
  approvals: z.array(sectorApprovalSchema),
  costs: z.array(sectorCostSchema),
  steps: z.array(sectorStepSchema),
  documents: z.array(sectorDocumentSchema),
})
export type SectorFull = z.infer<typeof sectorFullSchema>
