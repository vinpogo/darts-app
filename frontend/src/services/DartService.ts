
import apiClient from '../api'

import { type Suggestion } from '../../../shared/types'

export default {
  submit(data: any) {
    return apiClient.post('/', data)
  },
  getSuggestion(score: number): Promise<Suggestion> {
    return apiClient.get('/', { params: {score: score} })
  }
}
