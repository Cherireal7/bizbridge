/**
 * Better Auth core tables. Field names match Better Auth's expected schema so the
 * drizzle adapter can wire them automatically. Extra columns (country, user_type,
 * subscription_*) are exposed to Better Auth via `additionalFields` in plugins/auth.ts.
 */
import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import {
  userTypeEnum,
  subscriptionTierEnum,
  subscriptionStatusAppEnum,
} from './enums.js'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  // App-specific additionalFields (mirror PROJECT.md §4 users table)
  fullName: text('full_name'),
  phone: text('phone'),
  country: text('country'),
  userType: userTypeEnum('user_type').default('local'),
  subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
  subscriptionStatus: subscriptionStatusAppEnum('subscription_status').notNull().default('inactive'),
  subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
