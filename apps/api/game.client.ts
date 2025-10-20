import { hc } from 'hono/client'
import type { GameServerType } from './game.server.ts'

export const gameClient = hc<GameServerType>('api/game')
