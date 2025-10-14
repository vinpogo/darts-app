import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getBestCheckout } from '../aim/checkout.ts'
import { get, KvReadError, KvWriteError } from '../data/db.ts'
import type { Profile } from '../player/profile.ts'
import { addShot, newGame } from './doubleOut.ts'
import type { Shot } from './game.types.ts'

export const gameController = new Hono()
  .post('/', async (c) => {
    const { value: maybeGame } = await newGame(100)
    if (maybeGame instanceof KvWriteError) {
      throw new HTTPException(500, { message: maybeGame.message })
    }
    const { value: maybeProfile } = await get<Profile>(['profile'])
    if (maybeProfile instanceof KvReadError) {
      throw new HTTPException(500, { message: maybeProfile.message })
    }

    const { value } = await get(['game', maybeGame.id])
    console.log(value)

    console.time('get suggestions')
    const suggestions = getBestCheckout(maybeGame.score, maybeProfile)
    console.timeEnd('get suggestions')
    return c.json({ game: maybeGame, suggestions })
  })
  .post('/:id/shot', async (c) => {
    const id = c.req.param('id')
    const shot = await c.req.json<Shot>()

    const { value } = await get(['game', id])
    console.log(value)

    const result = await addShot(id, shot)
    const { value: maybeGame } = result
    console.log(maybeGame)

    if (maybeGame instanceof KvWriteError || maybeGame instanceof KvReadError) {
      throw new HTTPException(500, { message: maybeGame.message })
    }
    const { value: maybeProfile } = await get<Profile>(['profile'])
    if (maybeProfile instanceof KvReadError) {
      throw new HTTPException(500, { message: maybeProfile.message })
    }

    const suggestions = getBestCheckout(maybeGame.score, maybeProfile)
    // TODO: do something on bust or when finished
    return c.json({ game: maybeGame, suggestions })
  })
