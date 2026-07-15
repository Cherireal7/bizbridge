import { pgTable, uuid, text, timestamp, integer, boolean, index } from 'drizzle-orm/pg-core'
import { user } from './auth.js'

/**
 * `sector_id` and `step_id` reference Payload-managed tables (business-sectors, sector-steps).
 * No FK — referential integrity at app layer.
 */
export const userChecklists = pgTable(
  'user_checklists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    sectorId: uuid('sector_id').notNull(),
    title: text('title').notNull(),
    progressPercent: integer('progress_percent').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('user_checklists_user_idx').on(t.userId),
    sectorIdx: index('user_checklists_sector_idx').on(t.sectorId),
  }),
)

export const userChecklistItems = pgTable(
  'user_checklist_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    checklistId: uuid('checklist_id')
      .notNull()
      .references(() => userChecklists.id, { onDelete: 'cascade' }),
    stepId: uuid('step_id').notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    notes: text('notes'),
  },
  (t) => ({
    checklistIdx: index('user_checklist_items_checklist_idx').on(t.checklistId),
  }),
)

export type UserChecklist = typeof userChecklists.$inferSelect
export type NewUserChecklist = typeof userChecklists.$inferInsert
export type UserChecklistItem = typeof userChecklistItems.$inferSelect
export type NewUserChecklistItem = typeof userChecklistItems.$inferInsert
