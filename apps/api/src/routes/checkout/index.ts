import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { chapaService } from '../../services/chapa.service.js'
import { telebirrService } from '../../services/telebirr.service.js'
import { payments } from '../../db/schema/index.js'
import { env } from '../../env.js'

/**
 * Unified checkout entrypoints. The user picks a payment method on the /checkout
 * page; the client POSTs to the matching endpoint here.
 *
 *   POST /api/checkout/chapa         → Chapa hosted checkout URL
 *   POST /api/checkout/telebirr      → TeleBirr hosted checkout URL (stub)
 *   POST /api/checkout/bank-transfer → records a pending payment + returns bank details
 *
 * `kind` distinguishes tier purchase from a one-off report purchase. Both are
 * one-time payments (no subscriptions).
 */

const checkoutSchema = z.object({
  kind: z.enum(['tier', 'report']),
  tier: z.enum(['standard', 'pro']).optional(),
  report_slug: z.string().optional(),
  /** Optional client-side display info — server still treats amounts as source-of-truth. */
  amount_etb: z.number().positive().optional(),
})

const TIER_PRICE_ETB: Record<'standard' | 'pro', number> = {
  standard: 1600,
  pro: 8400,
}

function resolveOrder(input: z.infer<typeof checkoutSchema>) {
  if (input.kind === 'tier') {
    if (!input.tier) return null
    return {
      type: 'subscription' as const, // reuse the payment-type enum for now
      label: `BizBridge ${input.tier === 'pro' ? 'Pro' : 'Standard'} · one-time`,
      amount: TIER_PRICE_ETB[input.tier],
      meta: { kind: 'tier' as const, tier: input.tier },
    }
  }
  if (input.kind === 'report') {
    if (!input.report_slug) return null
    return {
      type: 'report' as const,
      label: `Report · ${input.report_slug}`,
      // TODO: lookup actual report price from Payload `reports` collection
      amount: input.amount_etb ?? 1500,
      meta: { kind: 'report' as const, report_slug: input.report_slug },
    }
  }
  return null
}

export const checkoutRoutes: FastifyPluginAsync = async (app) => {
  app.post('/chapa', { preHandler: app.requireAuth }, async (req, reply) => {
    const parse = checkoutSchema.safeParse(req.body)
    if (!parse.success) {
      return reply.code(400).send({ error: 'ValidationError', issues: parse.error.flatten() })
    }
    const order = resolveOrder(parse.data)
    if (!order) return reply.code(400).send({ error: 'InvalidOrder' })
    if (!chapaService.isConfigured) {
      return reply.code(503).send({
        error: 'ChapaNotConfigured',
        message: 'Set CHAPA_SECRET_KEY in apps/api/.env',
      })
    }

    const user = req.user!
    const tx_ref = chapaService.newTxRef(order.meta.kind === 'tier' ? order.meta.tier : 'rep')

    const [pending] = await app.db
      .insert(payments)
      .values({
        userId: user.id,
        provider: 'chapa',
        providerTransactionId: tx_ref,
        type: order.type,
        amount: order.amount.toFixed(2),
        currency: 'ETB',
        status: 'pending',
        metadata: order.meta,
      })
      .returning()

    try {
      const result = await chapaService.createCheckout({
        amount: order.amount,
        currency: 'ETB',
        email: user.email,
        tx_ref,
        callback_url: `${env.BETTER_AUTH_URL.replace(':3000', ':4000')}/api/webhooks/chapa`,
        return_url: `${env.FRONTEND_URL}/dashboard?paid=${tx_ref}`,
        customization: { title: 'BizBridge Ethiopia', description: order.label },
        meta: {
          user_id: user.id,
          payment_id: pending!.id,
          kind: order.meta.kind,
          ...('tier' in order.meta && order.meta.tier ? { tier: order.meta.tier } : {}),
          ...('report_slug' in order.meta && order.meta.report_slug
            ? { report_slug: order.meta.report_slug }
            : {}),
        },
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

  app.post('/telebirr', { preHandler: app.requireAuth }, async (req, reply) => {
    const parse = checkoutSchema.safeParse(req.body)
    if (!parse.success) {
      return reply.code(400).send({ error: 'ValidationError', issues: parse.error.flatten() })
    }
    const order = resolveOrder(parse.data)
    if (!order) return reply.code(400).send({ error: 'InvalidOrder' })

    if (!telebirrService.isConfigured) {
      return reply.code(503).send({
        error: 'TeleBirrNotConfigured',
        message:
          'TeleBirr keys are not set yet. Email hello@bizbridge.et or use Chapa / Bank transfer.',
      })
    }

    // When configured: create pending payment + initiate TeleBirr call.
    const user = req.user!
    const tx_ref = `tb_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    await app.db.insert(payments).values({
      userId: user.id,
      provider: 'chapa', // TeleBirr not yet in enum — Phase 2 enum addition
      providerTransactionId: tx_ref,
      type: order.type,
      amount: order.amount.toFixed(2),
      currency: 'ETB',
      status: 'pending',
      metadata: { ...order.meta, method: 'telebirr' },
    })
    const result = await telebirrService.initiate({
      amount: order.amount,
      currency: 'ETB',
      out_trade_no: tx_ref,
      subject: order.label,
      return_url: `${env.FRONTEND_URL}/dashboard?paid=${tx_ref}`,
      notify_url: `${env.BETTER_AUTH_URL.replace(':3000', ':4000')}/api/webhooks/telebirr`,
      customer_email: user.email,
    })
    return { checkout_url: result.checkout_url, tx_ref }
  })

  /**
   * Bank-transfer / Remitly: records a pending payment, returns bank details, and
   * sends the team an email to confirm receipt manually. No external API needed.
   */
  app.post('/bank-transfer', { preHandler: app.requireAuth }, async (req, reply) => {
    const parse = checkoutSchema.safeParse(req.body)
    if (!parse.success) {
      return reply.code(400).send({ error: 'ValidationError', issues: parse.error.flatten() })
    }
    const order = resolveOrder(parse.data)
    if (!order) return reply.code(400).send({ error: 'InvalidOrder' })

    const user = req.user!
    const tx_ref = `bt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

    await app.db.insert(payments).values({
      userId: user.id,
      provider: 'chapa', // reuse enum slot for now; new enum value in Phase 2
      providerTransactionId: tx_ref,
      type: order.type,
      amount: order.amount.toFixed(2),
      currency: 'ETB',
      status: 'pending',
      metadata: { ...order.meta, method: 'bank-transfer' },
    })

    // TODO: send notification email to ops@bizbridge.et with payment reference once Resend is wired.

    return {
      tx_ref,
      message:
        'Send a Remitly transfer or bank deposit to the account below, then email hello@bizbridge.et with your name and the reference code.',
      reference: tx_ref,
      amount_etb: order.amount,
      amount_usd: Math.round(order.amount / 56),
      bank: {
        bank_name: 'Commercial Bank of Ethiopia',
        account_name: 'BizBridge — Personal',
        account_number: '1000-XXXX-XXXX',
        swift: 'CBETETAA',
        branch: 'Bishoftu Main',
      },
      remitly_recipient: {
        name: 'Your name on file',
        country: 'Ethiopia',
        delivery: 'Bank deposit (CBE)',
      },
    }
  })
}
