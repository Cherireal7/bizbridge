import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 2.`,
})

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/user/me')),
  )
  app.patch('/me', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('PATCH /api/user/me')),
  )
  app.get('/purchases', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/user/purchases')),
  )
}
