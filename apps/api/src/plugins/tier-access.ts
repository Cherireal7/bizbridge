import fp from 'fastify-plugin'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { hasAtLeastTier, type SubscriptionTier } from '@bizbridge/shared'

declare module 'fastify' {
  interface FastifyInstance {
    requireTier: (tier: SubscriptionTier) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export const tierAccessPlugin = fp(async (app) => {
  app.decorate(
    'requireAuth',
    async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
    },
  )

  app.decorate(
    'requireTier',
    (tier: SubscriptionTier) =>
      async (req: FastifyRequest, reply: FastifyReply) => {
        if (!req.user) {
          return reply.code(401).send({ error: 'Unauthorized' })
        }
        if (!hasAtLeastTier(req.user.subscription_tier, tier)) {
          return reply.code(402).send({
            error: 'PaymentRequired',
            message: `This endpoint requires the ${tier} tier or higher.`,
            current_tier: req.user.subscription_tier,
            required_tier: tier,
          })
        }
      },
  )
})
