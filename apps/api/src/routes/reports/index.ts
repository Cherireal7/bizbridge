import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { chapaService } from '../../services/chapa.service.js'
import { payments } from '../../db/schema/index.js'
import { env } from '../../env.js'

const purchaseSchema = z.object({
  /** Optional override; reports default to ETB for Chapa. */
  amount_etb: z.number().positive().optional(),
})

export const reportRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({ docs: [] }))
  app.get('/:slug', async (_req, reply) =>
    reply.code(501).send({ error: 'NotImplemented', message: 'Report detail — Phase 2' }),
  )

  app.post('/:slug/purchase', { preHandler: app.requireAuth }, async (req, reply) => {
    const { slug } = req.params as { slug: string }
    const parse = purchaseSchema.safeParse(req.body ?? {})
    if (!parse.success) {
      return reply.code(400).send({ error: 'ValidationError', issues: parse.error.flatten() })
    }
    if (!chapaService.isConfigured) {
      return reply
        .code(503)
        .send({ error: 'ChapaNotConfigured', message: 'Set CHAPA_SECRET_KEY in apps/api/.env' })
    }

    // TODO: lookup report price from Payload `reports` collection by slug
    const amount = parse.data.amount_etb ?? 1500 // placeholder ETB price
    const user = req.user!
    const tx_ref = chapaService.newTxRef(`rep_${slug}`)

    const [pending] = await app.db
      .insert(payments)
      .values({
        userId: user.id,
        provider: 'chapa',
        providerTransactionId: tx_ref,
        type: 'report',
        amount: amount.toFixed(2),
        currency: 'ETB',
        status: 'pending',
        metadata: { report_slug: slug },
      })
      .returning()

    try {
      const result = await chapaService.createCheckout({
        amount,
        currency: 'ETB',
        email: user.email,
        tx_ref,
        callback_url: `${env.BETTER_AUTH_URL.replace(':3000', ':4000')}/api/webhooks/chapa`,
        return_url: `${env.FRONTEND_URL}/reports/${slug}?purchased=1`,
        customization: {
          title: 'BizBridge Report',
          description: `Report purchase · ${slug}`,
        },
        meta: { user_id: user.id, report_slug: slug, payment_id: pending!.id },
      })
      return { checkout_url: result.checkout_url, tx_ref }
    } catch (err) {
      await app.db
        .update(payments)
        .set({ status: 'failed', metadata: { error: (err as Error).message } })
        .where(eq(payments.id, pending!.id))
      return reply.code(502).send({ error: 'PaymentInitFailed', message: (err as Error).message })
    }
  })

  app.get('/:slug/download', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply
      .code(501)
      .send({ error: 'NotImplemented', message: 'Gated download — Phase 2 (needs R2)' }),
  )
}
