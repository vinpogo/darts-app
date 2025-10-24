import { Effect, Schema } from 'effect'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { get } from '~/data/db.ts'
import { addRound, newGame } from '~/games/doubleOut.ts'
import { type Game, shotsSchema } from '~/games/game.types.ts'
import type { Field, Miss } from '~/types/board.ts'
import { schemaValidator } from './schemaValidator.ts'

type Message = {
  message: string
  severity: 'error' | 'warning' | 'info'
}
type GameServerResponse = {
  id: string
  gameScore: number
  roundScore: number
  aimFor: Field[]
  hits: (Field | Miss)[]
  message?: Message
}

export const GameServer = new Hono()
  .post(
    '/',
    schemaValidator(
      'json',
      Schema.Struct({ score: Schema.optional(Schema.Number) }),
    ),
    async (c) => {
      const { score } = c.req.valid('json')
      const game = await Effect.runPromise(
        newGame(score ?? 501).pipe(
          Effect.catchTag(
            'KvWriteError',
            (e) => Effect.fail(new HTTPException(500, { message: e.message })),
          ),
          Effect.map(({ id, score }) => ({
            id,
            gameScore: score,
            roundScore: 0,
            aimFor: [] as Field[],
            hits: [] as Field[],
            message: { message: 'Good darts!', severity: 'info' } as Message,
          })),
        ),
      )
      return c.json<GameServerResponse>(game)
    },
  )
  .post(
    '/:id/score',
    schemaValidator(
      'json',
      shotsSchema.pipe(Schema.filter((s) => s.length <= 3 && s.length > 0)),
    ),
    schemaValidator(
      'param',
      Schema.Struct({
        id: Schema.NonEmptyString,
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param')
      const round = c.req.valid('json')
      c.req.valid('json')
      const response = await Effect.runPromise(
        Effect.gen(function* () {
          const game = yield* get<Game>(['game', id]).pipe(
            Effect.catchTag(
              'KvReadError',
              (e) =>
                Effect.fail(new HTTPException(500, { message: e.message })),
            ),
          )
          return yield* addRound(game, round).pipe(
            Effect.map((updatedGame) => ({
              id: updatedGame.id,
              gameScore: updatedGame.score,
              roundScore: 0,
              aimFor: [],
              hits: [],
            } satisfies GameServerResponse)),
            Effect.catchTag('InvalidShotsError', (error) =>
              Effect.succeed(
                {
                  id: game.id,
                  gameScore: game.score,
                  roundScore: 0,
                  aimFor: [],
                  hits: round.map(({ hit }) => hit),
                  message: {
                    message: error.message,
                    severity: 'error',
                  },
                } satisfies GameServerResponse,
              )),
            Effect.catchTag(
              'KvWriteError',
              (e) =>
                Effect.fail(new HTTPException(500, { message: e.message })),
            ),
          )
        }),
      )
      return c.json<GameServerResponse>(response)
    },
  )

export type GameServerType = typeof GameServer
