import { NotOk, Ok, type Result } from '@untier/result'
import { fieldToScore } from 'types/board.ts'
import { get, KvReadError, KvWriteError, set } from '../data/db.ts'
import { type Game, GameState, type Round, type Shot } from './game.types.ts'

export const newGame = (
  startingScore: number,
): Promise<Result<Game, KvWriteError>> => {
  const id = crypto.randomUUID()
  return set<Game>(['game', id], {
    id,
    score: startingScore,
    rounds: [],
    currentRound: 0,
    status: GameState.IN_PROGRESS,
  })
}
export class InvalidShotsError extends Error {}
const validateShots = (
  round: Shot[],
  game: Game,
): Result<Round, InvalidShotsError> => {
  if (round.length === 0) {
    return new NotOk(new InvalidShotsError('Throw at least one dart'))
  }
  if (round.length > 3) {
    return new NotOk(new InvalidShotsError('Too many darts thrown'))
  }
  const roundScore = round.reduce((sum, { hit }) => sum + fieldToScore(hit), 0)
  if (roundScore > game.score || game.score - roundScore === 1) {
    return new NotOk(new InvalidShotsError('Busted'))
  }
  return new Ok({ score: roundScore, darts: round })
}

export const addRound = async (
  id: Game['id'],
  shots: Shot[],
): Promise<Result<Game, InvalidShotsError | KvReadError | KvWriteError>> => {
  const { value: game } = await get<Game>(['game', id])
  if (game instanceof KvReadError) return new NotOk(game)

  const { value: round } = validateShots(shots, game)
  if (round instanceof InvalidShotsError) return new NotOk(round)

  const newScore = game.score - round.score
  const isFinished = shots.at(-1)!.hit.startsWith('D') && newScore === 0

  return set<Game>(['game', id], {
    ...game,
    status: isFinished ? GameState.DONE : game.status,
    rounds: [...game.rounds, round],
    score: newScore,
  })
}
