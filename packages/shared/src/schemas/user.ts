import { z } from 'zod'
import { USER_TYPES, SUBSCRIPTION_TIERS, SUBSCRIPTION_STATUSES } from '../constants.js'

export const userTypeSchema = z.enum(USER_TYPES)
export const subscriptionTierSchema = z.enum(SUBSCRIPTION_TIERS)
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES)

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20).optional(),
  country: z.string().length(2).toUpperCase(),
  user_type: userTypeSchema,
})
export type RegisterInput = z.infer<typeof registerInputSchema>

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})
export type LoginInput = z.infer<typeof loginInputSchema>

export const updateMeInputSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(20).optional(),
  country: z.string().length(2).toUpperCase().optional(),
  user_type: userTypeSchema.optional(),
})
export type UpdateMeInput = z.infer<typeof updateMeInputSchema>

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  phone: z.string().nullable(),
  country: z.string(),
  user_type: userTypeSchema,
  subscription_tier: subscriptionTierSchema,
  subscription_status: subscriptionStatusSchema,
  subscription_expires_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
})
export type PublicUser = z.infer<typeof publicUserSchema>
