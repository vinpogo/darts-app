import { Schema } from 'effect'
import { fieldSchema, missSchema } from 'types/board.ts'
export const shotSchema = Schema.Struct({
  aim: fieldSchema,
  hit: Schema.Union(fieldSchema, missSchema),
})
export type Shot = typeof shotSchema.Type
export const shotsSchema = Schema.Array(shotSchema)
export type Shots = typeof shotsSchema.Type

export const roundSchema = Schema.Struct({
  score: Schema.Number,
  darts: Schema.Array(shotSchema),
})
export type Round = typeof roundSchema.Type

export const gameStateSchema = Schema.Literal('IN_PROGRESS', 'DONE')
export type GameState = typeof gameStateSchema.Type
export const GameState: Record<GameState, GameState> = {
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
}

export const gameSchema = Schema.Struct({
  id: Schema.String,
  score: Schema.Number,
  rounds: Schema.Array(roundSchema),
  currentRound: Schema.Number,
  status: gameStateSchema,
})
export type Game = typeof gameSchema.Type
