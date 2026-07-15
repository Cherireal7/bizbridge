import { pgTable, uuid, text, timestamp, numeric, jsonb, index } from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import {
  paymentProviderEnum,
  paymentTypeEnum,
  paymentStatusEnum,
  currencyEnum,
} from './enums.js'

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    provider: paymentProviderEnum('provider').notNull(),
    providerTransactionId: text('provider_transaction_id'),
    type: paymentTypeEnum('type').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    currency: currencyEnum('currency').notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('payments_user_idx').on(t.userId),
    providerTxIdx: index('payments_provider_tx_idx').on(t.provider, t.providerTransactionId),
    statusIdx: index('payments_status_idx').on(t.status),
  }),
)

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
