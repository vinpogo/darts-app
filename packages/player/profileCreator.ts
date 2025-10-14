import { NotOk, type Result } from '@untier/result'
import { Field } from 'types/board.ts'
import { get, KvReadError, KvWriteError, set } from '../data/db.ts'
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
  if (!field) return Field[0]
  const nextIndex = 1 + Field.findIndex((f) => f === field)
  if (nextIndex === Field.length) return
  return Field[nextIndex]
}

export const startProfileCreation = async () =>
  await set<ProfileCreation>(['profileCreation'], {
    profile: emptyProfile(),
    target: nextTarget()!,
  })

export const addStep = async (
  step: CreationStep,
): Promise<Result<Profile | ProfileCreation, KvReadError | KvWriteError>> => {
  const profileCreation = await get<ProfileCreation>(['profileCreation'])
  if (profileCreation instanceof NotOk) return profileCreation
  const pc = profileCreation.value
  step.result.forEach((hit) => {
    pc.profile.hitRates[step.target] = upsertField(
      pc.profile.hitRates[step.target],
      hit,
    )
  })
  const next = nextTarget(pc.target)
  if (!next) return await set<Profile>(['profile'], pc.profile)
  return await set<ProfileCreation>(['profileCreation'], {
    profile: pc.profile,
    target: next,
  })
}
