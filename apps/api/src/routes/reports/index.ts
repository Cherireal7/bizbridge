import type { FastifyPluginAsync } from 'fastify'

export const reportRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({ docs: [] }))
  app.get('/:slug', async (_req, reply) =>
    reply.code(501).send({ error: 'NotImplemented', message: 'Report detail — Phase 2' }),
  )
}
