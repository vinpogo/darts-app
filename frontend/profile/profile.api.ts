import ky from 'ky'
import { Profile } from '../../packages/player/profile'
import {
  CreationStep,
  ProfileCreation,
} from '../../packages/player/profileCreator'

export const getNewProfileApi = () =>
  ky.get<ProfileCreation>('/api/profile/create/new').json()

export const postContinueProfileApi = (step: CreationStep) =>
  ky.post<Profile | ProfileCreation>('/api/profile/create/continue', {
    json: step,
  }).json()

export const getProfileApi = () => ky.get<Profile>('/api/profile').json()
