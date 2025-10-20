import { hc, type InferRequestType } from 'hono/client'
import ky from 'ky'
import type { GameServerType } from '../../api/game.server'
import type { Path } from '../../packages/aim/path'
import type { Game } from '../../packages/games/game.types'
import { Field } from '../../packages/types/board'

export const postShotApi = (id: string, shot: { aim: Field; hit: Field }) =>
  ky.post(`/api/game/${id}/shot`, { json: shot }).json<
    { game: Game; suggestions: Path }
  >()

const gameClient = hc<GameServerType>('api/game')
export const startGameApi = async () => {
  const res = await gameClient.index.$post()
  if (res.ok) {
    return res.json()
  }
  return res
}
export const postRoundApi = async (
  args: InferRequestType<typeof gameClient[':id']['score']['$post']>,
) => {
  const res = await gameClient[':id'].score.$post(args)
  if (res.ok) {
    return res.json()
  }
  return res
}
