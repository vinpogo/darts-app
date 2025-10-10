import { type Profile } from '../player/profile.ts'
import { rankedCheckouts, rankedFields } from '../player/statistics.ts'
import { getBestCheckout } from './checkout.ts'
import type { Path } from './path.ts'

const highestScore = (
  profile: Profile,
): Path => [
  rankedFields(profile)[0]!,
  rankedFields(profile)[0]!,
  rankedFields(profile)[0]!,
]

export const getBestContinuation = (score: number, profile: Profile): Path => {
  if ((score - 180) > 170) return highestScore(profile)
  const targetScore = rankedCheckouts(profile).filter((s) => s <= score)[0]
  if (!targetScore) return []
  return getBestCheckout(score - targetScore, profile)
}
