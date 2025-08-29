import { Field } from '../../../shared/types'
import apiClient from '../api'
export interface Round {
  aimed: Field
  hit: Field
}
export default {
  getRound(startingScore: number) {
    return apiClient.get(`/round/${startingScore}`)
  },
  createRound(data: Round[]) {
    return apiClient.post('/round', data)
  },
}
