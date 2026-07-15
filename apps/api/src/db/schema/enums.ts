import { pgEnum } from 'drizzle-orm/pg-core'

export const userTypeEnum = pgEnum('user_type', ['local', 'diaspora', 'foreign_investor'])
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'basic', 'pro'])
export const subscriptionStatusAppEnum = pgEnum('subscription_status_app', [
  'active',
  'inactive',
  'cancelled',
  'trial',
])
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['basic', 'pro'])
export const billingCycleEnum = pgEnum('billing_cycle', ['monthly', 'yearly'])
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'cancelled',
  'past_due',
  'trialing',
])
export const paymentProviderEnum = pgEnum('payment_provider', ['chapa', 'stripe'])
export const paymentTypeEnum = pgEnum('payment_type', [
  'subscription',
  'report',
  'booking',
  'setup_package',
])
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
])
export const currencyEnum = pgEnum('currency', ['ETB', 'USD'])
export const bookingSessionTypeEnum = pgEnum('booking_session_type', [
  'consultation',
  'setup_assistance',
  'custom_research',
])
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'refunded',
])
