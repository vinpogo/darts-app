import { NotOk } from '@untier/result'
import { Field } from 'types/board.ts'
import { get, set } from '../data/db.ts'
import { emptyProfile, type Profile, upsertField } from './profile.ts'

export type CreationStep = {
  target: Field
  result: Field[]
}

export type ProfileCreation = {
  profile: Profile
  target: Field
}

const nextTarget = (field?: Field): Field | undefined => {
  if (!field) Field[0]
  const nextIndex = 1 + Field.findIndex((f) => f === field)
  if (nextIndex === Field.length) return
  return Field[nextIndex]
}

export const startProfileCreation = async () =>
  await set<ProfileCreation>(['profileCreation'], {
    profile: emptyProfile(),
    target: nextTarget()!,
  })

export const addStep = async (step: CreationStep) => {
  const profileCreation = await get<ProfileCreation>(['profileCreation'])
  if (profileCreation instanceof NotOk) return profileCreation
  step.result.forEach((hit) => {
    profileCreation.value.profile.hitRates[step.target] = upsertField(
      profileCreation.value.profile.hitRates[step.target],
      hit,
    )
  })
  const next = nextTarget(profileCreation.value.target)
  if (!next) return set<Profile>(['profile'], profileCreation.value.profile)
  return set<ProfileCreation>(['profileCreation'], {
    profile: profileCreation.value.profile,
    target: next,
  })
}
