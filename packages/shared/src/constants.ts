export const USER_TYPES = ['local', 'diaspora', 'foreign_investor'] as const
export type UserType = (typeof USER_TYPES)[number]

export const SUBSCRIPTION_TIERS = ['free', 'basic', 'pro'] as const
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number]

export const SUBSCRIPTION_STATUSES = ['active', 'inactive', 'cancelled', 'trial', 'past_due', 'trialing'] as const
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export const BILLING_CYCLES = ['monthly', 'yearly'] as const
export type BillingCycle = (typeof BILLING_CYCLES)[number]

export const PAYMENT_PROVIDERS = ['chapa', 'stripe'] as const
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number]

export const PAYMENT_TYPES = ['subscription', 'report', 'booking', 'setup_package'] as const
export type PaymentType = (typeof PAYMENT_TYPES)[number]

export const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const CURRENCIES = ['ETB', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]

export const BOOKING_SESSION_TYPES = ['consultation', 'setup_assistance', 'custom_research'] as const
export type BookingSessionType = (typeof BOOKING_SESSION_TYPES)[number]

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const TIERS = ['free', 'premium'] as const
export type ContentTier = (typeof TIERS)[number]

export const FILE_TYPES = ['pdf', 'docx', 'xlsx'] as const
export type FileType = (typeof FILE_TYPES)[number]

export const SUPPORTED_LOCALES = ['en', 'am'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const PLATFORM_CITY = 'Bishoftu' as const
