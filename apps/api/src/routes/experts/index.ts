import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 3 (expert directory + Cal.com integration).`,
})

export const expertRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_req, reply) => reply.code(501).send(notImplemented('GET /api/experts')))
  app.get('/:id', async (_req, reply) => reply.code(501).send(notImplemented('GET /api/experts/:id')))
  app.post('/apply', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/experts/apply')),
  )
  app.get('/:id/availability', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/experts/:id/availability')),
  )
  app.post(
    '/:id/book',
    { preHandler: app.requireAuth },
    async (_req, reply) => reply.code(501).send(notImplemented('POST /api/experts/:id/book')),
  )
}
