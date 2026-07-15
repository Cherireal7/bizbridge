import Fastify, { type FastifyError, type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import sensible from '@fastify/sensible'
import rateLimit from '@fastify/rate-limit'

import { env } from './env.js'
import { dbPlugin } from './plugins/db.js'
import { authPlugin } from './plugins/auth.js'
import { tierAccessPlugin } from './plugins/tier-access.js'

import { authRoutes } from './routes/auth/index.js'
import { sectorRoutes } from './routes/sectors/index.js'
import { reportRoutes } from './routes/reports/index.js'
import { subscriptionRoutes } from './routes/subscriptions/index.js'
import { paymentRoutes } from './routes/payments/index.js'
import { expertRoutes } from './routes/experts/index.js'
import { bookingRoutes } from './routes/bookings/index.js'
import { checklistRoutes } from './routes/checklists/index.js'
import { calculatorRoutes } from './routes/calculator/index.js'
import { userRoutes } from './routes/user/index.js'
import { checkoutRoutes } from './routes/checkout/index.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
          : undefined,
    },
    disableRequestLogging: false,
    trustProxy: true,
  })

  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, {
    origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL].filter(Boolean),
    credentials: true,
  })
  await app.register(sensible)
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute' })

  await app.register(dbPlugin)
  await app.register(authPlugin)
  await app.register(tierAccessPlugin)

  app.get('/health', async () => ({ status: 'ok', service: 'bizbridge-api' }))

  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(sectorRoutes, { prefix: '/api/sectors' })
  await app.register(reportRoutes, { prefix: '/api/reports' })
  await app.register(subscriptionRoutes, { prefix: '/api/subscriptions' })
  await app.register(paymentRoutes, { prefix: '/api/webhooks' })
  await app.register(expertRoutes, { prefix: '/api/experts' })
  await app.register(bookingRoutes, { prefix: '/api/bookings' })
  await app.register(checklistRoutes, { prefix: '/api/checklists' })
  await app.register(calculatorRoutes, { prefix: '/api/calculator' })
  await app.register(userRoutes, { prefix: '/api/user' })
  await app.register(checkoutRoutes, { prefix: '/api/checkout' })

  app.setErrorHandler((err: FastifyError, _req, reply) => {
    app.log.error(err)
    if (err.validation) {
      return reply.status(400).send({ error: 'ValidationError', issues: err.validation })
    }
    if (err.statusCode && err.statusCode < 500) {
      return reply.status(err.statusCode).send({ error: err.message })
    }
    return reply.status(500).send({ error: 'InternalServerError' })
  })

  return app
}
