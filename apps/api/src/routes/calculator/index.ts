import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 2 (cost calculator).`,
})

export const calculatorRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/calculator')),
  )
}
