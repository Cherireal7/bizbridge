import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import { bookings } from './bookings.js'

/**
 * `expert_id` references the Payload-managed `experts` collection — no FK at DB level.
 */
export const expertReviews = pgTable(
  'expert_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    expertId: uuid('expert_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    expertIdx: index('expert_reviews_expert_idx').on(t.expertId),
    userIdx: index('expert_reviews_user_idx').on(t.userId),
  }),
)

export type ExpertReview = typeof expertReviews.$inferSelect
export type NewExpertReview = typeof expertReviews.$inferInsert
