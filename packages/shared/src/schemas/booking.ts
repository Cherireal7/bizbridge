import { z } from 'zod'
import { BOOKING_SESSION_TYPES, BOOKING_STATUSES } from '../constants.js'

export const bookingSessionTypeSchema = z.enum(BOOKING_SESSION_TYPES)
export const bookingStatusSchema = z.enum(BOOKING_STATUSES)

export const bookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  expert_id: z.string().uuid(),
  cal_booking_id: z.string().nullable(),
  session_type: bookingSessionTypeSchema,
  status: bookingStatusSchema,
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().positive(),
  price_usd: z.string(),
  price_birr: z.string(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
})
export type Booking = z.infer<typeof bookingSchema>

export const createBookingInputSchema = z.object({
  expert_id: z.string().uuid(),
  session_type: bookingSessionTypeSchema,
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().min(15).max(240),
  notes: z.string().max(2000).optional(),
})
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>
