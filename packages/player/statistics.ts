import { Field, fieldToScore } from 'types/board.ts'
import { descending } from '../helpers/sort.ts'
import type { Profile, Stats } from './profile.ts'

export const rankedCheckouts = (profile: Profile): number[] =>
  Object.entries(profile.checkoutChance)
    .sort(descending(([_, { rate }]) => rate))
    .map(([key, _]) => Number(key))

const weightedAverage = (stats: Stats): number =>
  Object.entries(stats)
    .reduce(
      (average, [field, rate]) => average + fieldToScore(field as Field) * rate,
      0,
    )

export const rankedFields = (profile: Profile): Field[] =>
  Field.toSorted(
    descending((field) => weightedAverage(profile.hitRates[field].stats)),
  )
