import type { Field, Miss } from 'types/board.ts'

export type Shot = {
  aim: Field
  hit: Field | Miss
}

export type Round = {
  score: number
  darts: Shot[]
}

export const GameState = { IN_PROGRESS: 'IN_PROGRESS', DONE: 'DONE' } as const
export type GameState = typeof GameState[keyof typeof GameState]

export type Game = {
  id: string
  score: number
  rounds: Round[]
  currentRound: number
  status: GameState
}
