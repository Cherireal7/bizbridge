import { pgTable, uuid, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import { payments } from './payments.js'

/**
 * `report_id` references the Payload-managed `reports` collection.
 * No FK constraint — Payload owns that table; enforce at app layer.
 */
export const userReportPurchases = pgTable(
  'user_report_purchases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    reportId: uuid('report_id').notNull(),
    paymentId: uuid('payment_id')
      .notNull()
      .references(() => payments.id, { onDelete: 'restrict' }),
    purchasedAt: timestamp('purchased_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  },
  (t) => ({
    userIdx: index('user_report_purchases_user_idx').on(t.userId),
    reportIdx: index('user_report_purchases_report_idx').on(t.reportId),
    uniqueUserReport: uniqueIndex('user_report_purchases_user_report_uq').on(t.userId, t.reportId),
  }),
)

export type UserReportPurchase = typeof userReportPurchases.$inferSelect
export type NewUserReportPurchase = typeof userReportPurchases.$inferInsert
