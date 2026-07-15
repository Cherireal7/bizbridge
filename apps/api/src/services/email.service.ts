import { env } from '../env.js'

export interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
  text?: string
  reply_to?: string
}

export class EmailService {
  async send(_input: SendEmailInput): Promise<{ id: string }> {
    if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured')
    throw new Error('EmailService.send not implemented — Phase 2')
  }
}

export const emailService = new EmailService()
