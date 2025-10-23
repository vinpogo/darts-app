import { hc, type InferRequestType } from 'hono/client'
import type { GameServerType } from '../../api/game.server'

export const gameClient = hc<GameServerType>('api/game')

export const startGameApi = async () => {
  const res = await gameClient.index.$post()
  if (!res.ok) return
  return res.json()
}
export const postRoundApi = async (
  args: InferRequestType<typeof gameClient[':id']['score']['$post']>,
) => {
  const res = await gameClient[':id'].score.$post(args)
  if (!res.ok) return
  return res.json()
}
