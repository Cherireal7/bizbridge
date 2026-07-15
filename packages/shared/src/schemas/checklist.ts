import { z } from 'zod'

export const userChecklistItemSchema = z.object({
  id: z.string().uuid(),
  checklist_id: z.string().uuid(),
  step_id: z.string().uuid(),
  is_completed: z.boolean(),
  completed_at: z.string().datetime().nullable(),
  notes: z.string().nullable(),
})
export type UserChecklistItem = z.infer<typeof userChecklistItemSchema>

export const userChecklistSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  sector_id: z.string().uuid(),
  title: z.string(),
  progress_percent: z.number().int().min(0).max(100),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  items: z.array(userChecklistItemSchema).optional(),
})
export type UserChecklist = z.infer<typeof userChecklistSchema>

export const createChecklistInputSchema = z.object({
  sector_id: z.string().uuid(),
  title: z.string().min(2).max(120).optional(),
})
export type CreateChecklistInput = z.infer<typeof createChecklistInputSchema>

export const toggleChecklistItemInputSchema = z.object({
  is_completed: z.boolean(),
  notes: z.string().max(2000).optional(),
})
export type ToggleChecklistItemInput = z.infer<typeof toggleChecklistItemInputSchema>
