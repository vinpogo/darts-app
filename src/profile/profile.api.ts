import ky from 'ky'
import { ProfileCreation } from '../../packages/player/profileCreator'

export const getNewProfileApi = () =>
  ky.get<ProfileCreation>('/profile/creat/new').json()
