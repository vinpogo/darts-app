import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getBestCheckout } from '../packages/aim/checkout.ts'
import { randomProfile } from '../packages/player/profile.ts'

const profile = randomProfile()
const app = new Hono()
  .basePath('/api')
  .get('/suggestion/:score', (c) => {
    const score = Number(c.req.param('score'))
    if (!Number.isFinite(score)) {
      throw new HTTPException(400, { message: 'Score has to be a number' })
    }
    return c.json(getBestCheckout(score, profile))
  })

Deno.serve(app.fetch)
