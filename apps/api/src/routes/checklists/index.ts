import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 2 (checklist generator).`,
})

export const checklistRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/checklists')),
  )
  app.post('/', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/checklists')),
  )
  app.get('/:id', { preHandler: app.requireAuth }, async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/checklists/:id')),
  )
  app.patch(
    '/:id/items/:itemId',
    { preHandler: app.requireAuth },
    async (_req, reply) =>
      reply.code(501).send(notImplemented('PATCH /api/checklists/:id/items/:itemId')),
  )
}
