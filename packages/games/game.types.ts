import { fieldSchema, missSchema } from 'types/board.ts'
import * as z from 'zod'

export const shotSchema = z.object({
  aim: fieldSchema,
  hit: z.union([fieldSchema, missSchema]),
})
export type Shot = z.infer<typeof shotSchema>

export const roundSchema = z.object({
  score: z.number(),
  darts: shotSchema.array(),
})
export type Round = z.infer<typeof roundSchema>

export const gameStateSchema = z.literal(['IN_PROGRESS', 'DONE'])
export type GameState = z.infer<typeof gameStateSchema>
export const GameState: Record<GameState, GameState> = {
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
}

export const gameSchema = z.object({
  id: z.string(),
  score: z.number(),
  rounds: roundSchema.array(),
  currentRound: z.number(),
  status: gameStateSchema,
})
export type Game = z.infer<typeof gameSchema>
