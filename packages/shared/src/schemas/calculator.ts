import { z } from 'zod'

export const calculatorInputSchema = z.object({
  sector_id: z.string().uuid(),
  business_type: z.enum(['sole_proprietorship', 'plc', 'share_company', 'branch', 'representative_office']),
  employees: z.number().int().min(0).max(10_000),
  capital_birr: z.number().nonnegative().optional(),
  city: z.string().default('Bishoftu'),
  user_type: z.enum(['local', 'diaspora', 'foreign_investor']).default('local'),
})
export type CalculatorInput = z.infer<typeof calculatorInputSchema>

export const calculatorBreakdownLineSchema = z.object({
  label: z.string(),
  amount_birr_min: z.number().nonnegative(),
  amount_birr_max: z.number().nonnegative(),
  is_official_fee: z.boolean(),
  notes: z.string().nullable(),
})
export type CalculatorBreakdownLine = z.infer<typeof calculatorBreakdownLineSchema>

export const calculatorResultSchema = z.object({
  total_birr_min: z.number().nonnegative(),
  total_birr_max: z.number().nonnegative(),
  total_usd_min: z.number().nonnegative(),
  total_usd_max: z.number().nonnegative(),
  fx_rate: z.number().positive(),
  estimated_days_min: z.number().int().nonnegative(),
  estimated_days_max: z.number().int().nonnegative(),
  lines: z.array(calculatorBreakdownLineSchema),
  disclaimer: z.string(),
})
export type CalculatorResult = z.infer<typeof calculatorResultSchema>
