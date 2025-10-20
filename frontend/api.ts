import ky from 'ky'
import type { ProfileCreation } from '../packages/player/profileCreator.ts'

export const createProfileApi = () =>
  ky.get<ProfileCreation>('/profile/create/new')
