
import apiClient from '../api'
export default {
  getRound(startingScore: number) {
    return apiClient.get(`/round/${startingScore}`)
  },
  createRound(data: []) {
    return apiClient.post('/', data)
  },
}
