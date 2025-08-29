import apiClient from '../api';
export interface Round {
  aimed: number,
  hit: number
}
export default {
  getRound(startingScore: number) {
    return apiClient.get(`/round/${startingScore}`);
  },
  createRound(data: Round[]) {
    return apiClient.post('/round', data);
  },
};
