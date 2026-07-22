import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 2 (checklist generator).`,
})

export const checklistRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/checklists')),
  )
  app.post('/', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/checklists')),
  )
  app.get('/:id', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/checklists/:id')),
  )
  app.patch('/:id/items/:itemId', async (_req, reply) =>
    reply.code(501).send(notImplemented('PATCH /api/checklists/:id/items/:itemId')),
  )
}
