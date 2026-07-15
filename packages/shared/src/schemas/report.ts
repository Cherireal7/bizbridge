import { z } from 'zod'

export const reportListItemSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  sector_id: z.string().uuid().nullable(),
  price_usd: z.string(),
  price_birr: z.string(),
  preview_url: z.string().url().nullable(),
  is_published: z.boolean(),
})
export type ReportListItem = z.infer<typeof reportListItemSchema>

export const userReportPurchaseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  report_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  purchased_at: z.string().datetime(),
  expires_at: z.string().datetime().nullable(),
})
export type UserReportPurchase = z.infer<typeof userReportPurchaseSchema>
