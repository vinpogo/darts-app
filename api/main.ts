import { NotOk } from '@untier/result'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getBestCheckout } from '../packages/aim/checkout.ts'
import { get } from '../packages/data/db.ts'
import {
  emptyProfile,
  type Profile,
  randomProfile,
} from '../packages/player/profile.ts'
import {
  addStep,
  type CreationStep,
  startProfileCreation,
} from '../packages/player/profileCreator.ts'

const app = new Hono()
  .basePath('/api')
  .get('/suggestion/:score', (c) => {
    const score = Number(c.req.param('score'))
    if (!Number.isFinite(score)) {
      throw new HTTPException(400, { message: 'Score has to be a number' })
    }
    const profile = randomProfile()
    return c.json({
      go: getBestCheckout(score, profile),
      T20: profile.hitRates['T20'].stats,
      T19: profile.hitRates['T19'].stats,
    })
  })
  .get('/profile', async (c) => {
    const profile = await get<Profile>(['profile'])
    if (profile instanceof NotOk) return c.json(emptyProfile())
    return c.json(profile.value)
  })
  .get('/profile/create/new', async (c) => {
    const res = await startProfileCreation()
    if (res instanceof NotOk) {
      throw new HTTPException(500)
    }
    return c.json(res.value)
  })
  .post('/profile/create/continue', async (c) => {
    const step = await c.req.json<CreationStep>()
    const res = await addStep(step)
    if (res instanceof NotOk) {
      throw new HTTPException(500)
    }
    return c.json(res.value)
  })

Deno.serve({ port: 8080 }, app.fetch)
