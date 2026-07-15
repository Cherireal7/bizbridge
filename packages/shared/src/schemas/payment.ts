import { z } from 'zod'
import { PAYMENT_PROVIDERS, PAYMENT_TYPES, PAYMENT_STATUSES, CURRENCIES } from '../constants.js'

export const paymentProviderSchema = z.enum(PAYMENT_PROVIDERS)
export const paymentTypeSchema = z.enum(PAYMENT_TYPES)
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES)
export const currencySchema = z.enum(CURRENCIES)

export const paymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  provider: paymentProviderSchema,
  provider_transaction_id: z.string().nullable(),
  type: paymentTypeSchema,
  amount: z.string(),
  currency: currencySchema,
  status: paymentStatusSchema,
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.string().datetime(),
})
export type Payment = z.infer<typeof paymentSchema>

export const chapaWebhookSchema = z.object({
  event: z.string(),
  status: z.string(),
  tx_ref: z.string(),
  reference: z.string().optional(),
  amount: z.union([z.string(), z.number()]),
  currency: z.string(),
})
export type ChapaWebhook = z.infer<typeof chapaWebhookSchema>
