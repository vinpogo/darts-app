import ky from 'ky'
import { Path } from '../../packages/aim/path'
import { Game } from '../../packages/games/game.types'
import { Field } from '../../packages/types/board'

export const startGameApi = () =>
  ky.post('api/game').json<{ game: Game; suggestions: Path }>()
export const postShotApi = (id: string, shot: { aim: Field; hit: Field }) =>
  ky.post(`/api/game/${id}/shot`, { json: shot }).json<
    { game: Game; suggestions: Path }
  >()
