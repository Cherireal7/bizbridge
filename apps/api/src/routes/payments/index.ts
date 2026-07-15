import type { FastifyPluginAsync } from 'fastify'
import { eq } from 'drizzle-orm'
import { chapaService } from '../../services/chapa.service.js'
import { payments, subscriptions } from '../../db/schema/index.js'

/**
 * Chapa webhook handler.
 *
 * Chapa POSTs payment notifications here. We:
 *   1. Verify HMAC-SHA256 signature (x-chapa-signature) against CHAPA_WEBHOOK_SECRET.
 *   2. Look up the local payment row by tx_ref (provider_transaction_id).
 *   3. Re-verify via Chapa /verify/{tx_ref} — never trust webhook body alone.
 *   4. Apply the resulting state idempotently.
 */
export const paymentRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    '/chapa',
    {
      // Fastify normally JSON-parses the body. We need the raw string for HMAC.
      preParsing: async (req, _reply, payload) => {
        const chunks: Buffer[] = []
        for await (const chunk of payload) chunks.push(chunk as Buffer)
        const raw = Buffer.concat(chunks).toString('utf8')
        ;(req as unknown as { rawBody?: string }).rawBody = raw
        return Buffer.from(raw)
      },
    },
    async (req, reply) => {
      const headers: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(req.headers)) {
        headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : v
      }
      const rawBody = (req as unknown as { rawBody?: string }).rawBody ?? ''

      try {
        const ok = chapaService.verifyWebhookSignature(headers, rawBody)
        if (!ok) {
          app.log.warn('Chapa webhook signature mismatch')
          return reply.code(401).send({ error: 'InvalidSignature' })
        }
      } catch (err) {
        // CHAPA_WEBHOOK_SECRET not configured — accept the webhook in dev but log it
        if (process.env.NODE_ENV === 'production') {
          return reply.code(500).send({ error: 'WebhookConfigMissing' })
        }
        app.log.warn({ err }, 'Chapa webhook secret missing — accepting in dev only')
      }

      let body: { tx_ref?: string; status?: string; event?: string }
      try {
        body = JSON.parse(rawBody)
      } catch {
        return reply.code(400).send({ error: 'InvalidJson' })
      }
      if (!body.tx_ref) {
        return reply.code(400).send({ error: 'MissingTxRef' })
      }

      const existing = await app.db
        .select()
        .from(payments)
        .where(eq(payments.providerTransactionId, body.tx_ref))
        .limit(1)
      const payment = existing[0]
      if (!payment) {
        app.log.warn({ tx_ref: body.tx_ref }, 'Chapa webhook for unknown tx_ref')
        return reply.code(404).send({ error: 'PaymentNotFound' })
      }

      // Idempotency: if already completed/failed, don't reprocess.
      if (payment.status === 'completed' || payment.status === 'failed') {
        return { status: payment.status, idempotent: true }
      }

      // Re-verify via Chapa's API — never trust the webhook body alone.
      const verified = await chapaService.verifyTransaction(body.tx_ref)
      if (verified.status === 'success') {
        await app.db
          .update(payments)
          .set({ status: 'completed' })
          .where(eq(payments.id, payment.id))

        // Activate subscription if this was a subscription payment
        if (payment.type === 'subscription') {
          const meta = (payment.metadata ?? {}) as { plan?: 'basic' | 'pro'; billing_cycle?: 'monthly' | 'yearly' }
          if (meta.plan && meta.billing_cycle) {
            const periodEnd = new Date()
            if (meta.billing_cycle === 'yearly') periodEnd.setFullYear(periodEnd.getFullYear() + 1)
            else periodEnd.setMonth(periodEnd.getMonth() + 1)

            await app.db.insert(subscriptions).values({
              userId: payment.userId,
              plan: meta.plan,
              billingCycle: meta.billing_cycle,
              provider: 'chapa',
              providerSubscriptionId: body.tx_ref,
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: periodEnd,
            })
          }
        }
        return { status: 'completed' }
      }

      if (verified.status === 'failed') {
        await app.db
          .update(payments)
          .set({ status: 'failed' })
          .where(eq(payments.id, payment.id))
        return { status: 'failed' }
      }

      return { status: 'pending' }
    },
  )

  app.post('/stripe', async (_req, reply) => {
    return reply.code(501).send({
      error: 'StripeDeferred',
      message: 'Stripe wiring deferred — using Chapa-only payments for the current phase.',
    })
  })
}
