import { Effect } from 'effect'
import { fieldToScore } from 'types/board.ts'
import { KvReadError, KvWriteError, set } from '../data/db.ts'
import { type Game, GameState, type Round, type Shots } from './game.types.ts'

export const newGame = (
  startingScore: number,
) => {
  const id = crypto.randomUUID()
  return set<Game>(['game', id], {
    id,
    score: startingScore,
    rounds: [],
    currentRound: 0,
    status: GameState.IN_PROGRESS,
  })
}
export class InvalidShotsError extends Error {
  readonly _tag = 'InvalidShotsError'
}
const validateShots = (
  shots: Shots,
  game: Game,
): Effect.Effect<Round, InvalidShotsError> => {
  if (shots.length === 0) {
    return Effect.fail(new InvalidShotsError('Throw at least one dart'))
  }
  if (shots.length > 3) {
    return Effect.fail(new InvalidShotsError('Too many darts thrown'))
  }
  const roundScore = shots.reduce((sum, { hit }) => sum + fieldToScore(hit), 0)
  if (roundScore > game.score || game.score - roundScore === 1) {
    return Effect.fail(new InvalidShotsError('Busted'))
  }
  return Effect.succeed({ score: roundScore, darts: shots })
}

export const addRound = (
  game: Game,
  shots: Shots,
): Effect.Effect<Game, InvalidShotsError | KvReadError | KvWriteError> =>
  validateShots(shots, game).pipe(
    Effect.flatMap((round) => {
      const newScore = game.score - round.score
      const isFinished = shots.at(-1)!.hit.startsWith('D') && newScore === 0

      return set<Game>(['game', game.id], {
        ...game,
        status: isFinished ? GameState.DONE : game.status,
        rounds: [...game.rounds, round],
        score: newScore,
      })
    }),
  )
