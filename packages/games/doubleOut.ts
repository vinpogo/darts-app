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
export class InvalidRoundError extends Error {}
const validateRound = (
  round: Shot[],
  game: Game,
): Result<Round, InvalidRoundError> => {
  if (round.length === 0) {
    return new NotOk(new InvalidRoundError('Throw at least one dart'))
  }
  if (round.length > 3) {
    return new NotOk(new InvalidRoundError('Too many darts thrown'))
  }
  const roundScore = round.reduce((sum, { hit }) => sum + fieldToScore(hit), 0)
  if (roundScore > game.score) return new NotOk(new InvalidRoundError('Bust'))
  return new Ok({ score: roundScore, darts: round })
}

export const addRound = async (
  id: Game['id'],
  round: Shot[],
): Promise<Result<Game, InvalidRoundError | KvReadError | KvWriteError>> => {
  const game = await get<Game>(['game', id])
  return game.flatMap((value) => {
    if (value instanceof KvReadError) return new NotOk(value)
    const foo = validateRound(round, value).flatMap((maybeRound) => {
      if (maybeRound instanceof InvalidRoundError) {
        return new NotOk(maybeRound)
      }
      return set<Game>(['game', id], {
        ...value,
        rounds: [...value.rounds, maybeRound],
        score: value.score - maybeRound.score,
      })
    })
    return foo
  })
}

export const addShot = async (
  id: Game['id'],
  shot: Shot,
): Promise<Result<Game, Game | KvReadError | KvWriteError>> => {
  const maybeGame = await get<Game>(['game', id])
  const g = maybeGame.flatMap((game) => {
    if (game instanceof KvReadError) return new NotOk(game)
    const round = game.rounds[game.currentRound] ?? { score: 0, darts: [] }
    round.darts.push(shot)
    round.score += fieldToScore(shot.hit)
    const newGameScore = game.score - round.score
    const busted = newGameScore === 1 || newGameScore < 0
    const gameDone = newGameScore === 0 && shot.hit.startsWith('D')
    if (busted) {
      return new NotOk(game)
    }
    if (gameDone) {
      game.status = GameState.DONE
    }

    game.rounds[game.currentRound] = round
    game.score = newGameScore

    if (!gameDone && round.darts.length === 3) game.currentRound++
    return game as unknown as Ok<Game>
  })
  if (g instanceof NotOk) return g
  return set<Game>(['game', id], g.value)
}
