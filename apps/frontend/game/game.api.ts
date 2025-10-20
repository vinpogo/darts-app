import { type InferRequestType } from 'hono/client'
import { gameClient } from '../../api/game.client'

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
