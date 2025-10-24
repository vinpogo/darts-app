import { expect } from '@std/expect'
import { app } from './main.ts'

const post = async (path: string, body: any) => {
  return app.request(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
}

Deno.test('POST /api/game: creates game with given starting score', async () => {
  const res = await post('/api/game', { score: 300 })

  expect(await res.json()).toEqual(
    expect.objectContaining({ gameScore: 300 }),
  )
})
Deno.test('POST /api/game: creates game with starting score of 501 when no score passed', async () => {
  const res = await post('/api/game', {})

  expect(await res.json()).toEqual(
    expect.objectContaining({ gameScore: 501 }),
  )
})

Deno.test('POST /api/game/:id/score: correctly deducts score', async (t) => {
  let gameId = ''
  await t.step('create game', async () => {
    const res = await post('/api/game', { score: 300 })
    gameId = (await res.json()).id
  })

  await t.step('score', async () => {
    const res = await post(`/api/game/${gameId}/score`, [{
      hit: 'T20',
      aim: 'T20',
    }])
    expect(await res.json()).toEqual(
      expect.objectContaining({
        gameScore: 240,
        rounds: expect.arrayContaining([{ hit: 'T20', aim: 'T20' }]),
      }),
    )
  })
})
