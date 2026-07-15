import { z } from 'zod'
import {
  SUBSCRIPTION_STATUSES,
  BILLING_CYCLES,
  PAYMENT_PROVIDERS,
  SUBSCRIPTION_TIERS,
} from '../constants.js'

export const subscriptionPlanSchema = z.enum(['basic', 'pro'])
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan: subscriptionPlanSchema,
  billing_cycle: z.enum(BILLING_CYCLES),
  provider: z.enum(PAYMENT_PROVIDERS),
  provider_subscription_id: z.string().nullable(),
  status: z.enum(SUBSCRIPTION_STATUSES),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  cancelled_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
})
export type Subscription = z.infer<typeof subscriptionSchema>

export const checkoutInputSchema = z.object({
  plan: subscriptionPlanSchema,
  billing_cycle: z.enum(BILLING_CYCLES),
  provider: z.enum(PAYMENT_PROVIDERS),
})
export type CheckoutInput = z.infer<typeof checkoutInputSchema>

export const subscriptionTierEnum = z.enum(SUBSCRIPTION_TIERS)
