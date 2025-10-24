import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { GameServer } from './game.server.ts'

export const app = new Hono()
  .basePath('/api')
  .use(logger())
  .route('/game', GameServer)

Deno.serve({ port: 8080 }, app.fetch)
