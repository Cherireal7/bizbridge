import type { FastifyPluginAsync } from 'fastify'

const notImplemented = (action: string) => ({
  error: 'NotImplemented',
  message: `${action} — Phase 2 (Better Auth wiring).`,
})

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', async (_req, reply) => reply.code(501).send(notImplemented('POST /api/auth/register')))
  app.post('/login', async (_req, reply) => reply.code(501).send(notImplemented('POST /api/auth/login')))
  app.post('/logout', async (_req, reply) => reply.code(501).send(notImplemented('POST /api/auth/logout')))
  app.post('/refresh', async (_req, reply) => reply.code(501).send(notImplemented('POST /api/auth/refresh')))
  app.post('/forgot-password', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/auth/forgot-password')),
  )
  app.post('/reset-password', async (_req, reply) =>
    reply.code(501).send(notImplemented('POST /api/auth/reset-password')),
  )
}
