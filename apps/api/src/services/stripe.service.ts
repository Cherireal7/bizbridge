import { env } from '../env.js'

export interface StripeCheckoutInput {
  price_id: string
  customer_email: string
  success_url: string
  cancel_url: string
  metadata?: Record<string, string>
}

export class StripeService {
  private readonly secretKey: string | undefined

  constructor() {
    this.secretKey = env.STRIPE_SECRET_KEY
  }

  async createSubscriptionCheckout(_input: StripeCheckoutInput): Promise<{ checkout_url: string }> {
    if (!this.secretKey) throw new Error('STRIPE_SECRET_KEY not configured')
    throw new Error('StripeService.createSubscriptionCheckout not implemented — Phase 2')
  }

  verifyWebhookSignature(_headers: Record<string, string>, _rawBody: string) {
    if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    throw new Error('StripeService.verifyWebhookSignature not implemented — Phase 2')
  }
}

export const stripeService = new StripeService()
