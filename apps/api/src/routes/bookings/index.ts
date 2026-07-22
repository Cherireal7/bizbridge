import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 3 (bookings).`,
})

export const bookingRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/bookings')),
  )
  app.get('/:id', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/bookings/:id')),
  )
  app.post('/:id/cancel', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/bookings/:id/cancel')),
  )
}
