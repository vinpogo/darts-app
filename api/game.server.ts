import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import z from 'zod'
import { KvReadError, KvWriteError } from '~/data/db.ts'
import { addRound, InvalidShotsError, newGame } from '~/games/doubleOut.ts'
import { shotSchema } from '~/games/game.types.ts'

export const GameServer = new Hono()
  .post('/', async (c) => {
    const { value: maybeGame } = await newGame(100)
    if (maybeGame instanceof KvWriteError) {
      throw new HTTPException(500, { message: maybeGame.message })
    }

    return c.json(maybeGame)
  })
  .post(
    '/:id/score',
    zValidator('json', shotSchema.array().max(3)),
    async (c) => {
      const id = c.req.param('id')
      z.string().parse(id)
      const { value: game } = await addRound(id, await c.req.json())
      if (game instanceof KvReadError || game instanceof KvWriteError) {
        throw new HTTPException(500, { message: game.message })
      }

      if (game instanceof InvalidShotsError) {
        throw new HTTPException(400, { message: game.message })
      }

      return c.json(game)
    },
  )

export type GameServerType = typeof GameServer
