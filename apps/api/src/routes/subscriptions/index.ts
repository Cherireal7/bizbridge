import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { chapaService } from '../../services/chapa.service.js'
import { payments } from '../../db/schema/index.js'
import { env } from '../../env.js'

const checkoutSchema = z.object({
  plan: z.enum(['basic', 'pro']),
  billing_cycle: z.enum(['monthly', 'yearly']),
  provider: z.enum(['chapa']).default('chapa'),
})

/**
 * Pricing per plan in ETB.
 * TODO: replace with PricingConfig lookup once the Payload global has been finalized.
 */
const PRICE_ETB: Record<string, Record<string, number>> = {
  basic: { monthly: 500, yearly: 5000 },
  pro: { monthly: 1600, yearly: 16000 },
}

export const subscriptionRoutes: FastifyPluginAsync = async (app) => {
  app.get('/plans', async () => ({
    plans: [
      { id: 'basic', monthly_etb: 500, yearly_etb: 5000, monthly_usd: 9, yearly_usd: 90 },
      { id: 'pro', monthly_etb: 1600, yearly_etb: 16000, monthly_usd: 29, yearly_usd: 290 },
    ],
  }))

  app.post('/checkout', { preHandler: app.requireAuth }, async (req, reply) => {
    const parse = checkoutSchema.safeParse(req.body)
    if (!parse.success) {
      return reply.code(400).send({ error: 'ValidationError', issues: parse.error.flatten() })
    }
    const { plan, billing_cycle } = parse.data
    const user = req.user!
    const amount = PRICE_ETB[plan]?.[billing_cycle]
    if (!amount) {
      return reply.code(400).send({ error: 'InvalidPlan' })
    }

    if (!chapaService.isConfigured) {
      return reply
        .code(503)
        .send({ error: 'ChapaNotConfigured', message: 'Set CHAPA_SECRET_KEY in apps/api/.env' })
    }

    const tx_ref = chapaService.newTxRef(`sub_${plan}_${billing_cycle}`)
    const [pending] = await app.db
      .insert(payments)
      .values({
        userId: user.id,
        provider: 'chapa',
        providerTransactionId: tx_ref,
        type: 'subscription',
        amount: amount.toFixed(2),
        currency: 'ETB',
        status: 'pending',
        metadata: { plan, billing_cycle },
      })
      .returning()

    try {
      const result = await chapaService.createCheckout({
        amount,
        currency: 'ETB',
        email: user.email,
        tx_ref,
        callback_url: `${env.BETTER_AUTH_URL.replace(':3000', ':4000')}/api/webhooks/chapa`,
        return_url: `${env.FRONTEND_URL}/dashboard?subscribed=1`,
        customization: {
          title: 'BizBridge Ethiopia',
          description: `Subscription · ${plan} · ${billing_cycle}`,
        },
        meta: { user_id: user.id, plan, billing_cycle, payment_id: pending!.id },
      })
      return { checkout_url: result.checkout_url, tx_ref }
    } catch (err) {
      await app.db
        .update(payments)
        .set({ status: 'failed', metadata: { error: (err as Error).message } })
        .where(eq(payments.id, pending!.id))
      app.log.error({ err }, 'chapa checkout init failed')
      return reply.code(502).send({ error: 'PaymentInitFailed', message: (err as Error).message })
    }
  })

  app.post('/cancel', { preHandler: app.requireAuth }, async (_req, reply) => {
    return reply
      .code(501)
      .send({ error: 'NotImplemented', message: 'Subscription cancellation — Phase 2' })
  })

  app.get('/status', { preHandler: app.requireAuth }, async (_req, reply) => {
    return reply
      .code(501)
      .send({ error: 'NotImplemented', message: 'Subscription status lookup — Phase 2' })
  })
}
