import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 1 (sector queries against Payload-managed tables).`,
})

export const sectorRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_req, reply) => reply.code(501).send(notImplemented('GET /api/sectors')))
  app.get('/:slug', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/sectors/:slug')),
  )
  app.get('/:slug/full', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/sectors/:slug/full')),
  )
  app.get('/:slug/steps', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/sectors/:slug/steps')),
  )
  app.get('/:slug/costs', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/sectors/:slug/costs')),
  )
  app.get('/:slug/documents', async (_req, reply) =>
    reply.code(501).send(notImplemented('GET /api/sectors/:slug/documents')),
  )
}
