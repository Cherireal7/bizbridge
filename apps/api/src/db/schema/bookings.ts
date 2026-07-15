import { pgTable, uuid, text, timestamp, integer, numeric, index } from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import { payments } from './payments.js'
import { bookingSessionTypeEnum, bookingStatusEnum } from './enums.js'

/**
 * `expert_id` is a uuid that references the Payload-managed `experts` collection.
 * We do NOT add a foreign key here because Payload owns that table's migrations;
 * referential integrity is enforced at the application layer.
 */
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    expertId: uuid('expert_id').notNull(),
    calBookingId: text('cal_booking_id'),
    sessionType: bookingSessionTypeEnum('session_type').notNull(),
    status: bookingStatusEnum('status').notNull().default('pending'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    priceUsd: numeric('price_usd', { precision: 12, scale: 2 }).notNull(),
    priceBirr: numeric('price_birr', { precision: 12, scale: 2 }).notNull(),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('bookings_user_idx').on(t.userId),
    expertIdx: index('bookings_expert_idx').on(t.expertId),
    statusIdx: index('bookings_status_idx').on(t.status),
    scheduledAtIdx: index('bookings_scheduled_at_idx').on(t.scheduledAt),
  }),
)

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
