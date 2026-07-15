import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import {
  subscriptionPlanEnum,
  billingCycleEnum,
  paymentProviderEnum,
  subscriptionStatusEnum,
} from './enums.js'

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    plan: subscriptionPlanEnum('plan').notNull(),
    billingCycle: billingCycleEnum('billing_cycle').notNull(),
    provider: paymentProviderEnum('provider').notNull(),
    providerSubscriptionId: text('provider_subscription_id'),
    status: subscriptionStatusEnum('status').notNull(),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('subscriptions_user_idx').on(t.userId),
    statusIdx: index('subscriptions_status_idx').on(t.status),
  }),
)

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
