
import apiClient from '../api'

import { type Field, type Suggestion } from '../../../shared/types'

export default {
  submit(data: Field[]) {
    return apiClient.post('/', data)
  },
  getSuggestion(score: number): Promise<Suggestion> {
    return apiClient.get('/', { headers: {score: score} })
  }
}
