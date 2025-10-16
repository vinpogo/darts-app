import { Field, fieldToScore, isField } from 'types/board.ts'
import type { Profile, Stats } from '../player/profile.ts'
import {
  isCheckout,
  isResolved,
  type Path,
  pathChance,
  type ResolvedField,
  type ResolvingPath,
} from './path.ts'
import possibilities from './possibilities.json' with { type: 'json' }

const cache: Map<string, number> = new Map()
const getCache = (path: ResolvingPath) => cache.get(JSON.stringify(path))

export const getCheckouts = (score: number): Field[][] =>
  // @ts-expect-error stupid json
  possibilities[String(score)]

export const splitOnIndex = (
  arr: ResolvingPath,
  idx: number,
): ResolvingPath[] => {
  const result: ResolvingPath[] = [arr.slice(0, idx + 1)]
  for (let base = idx + 1; base < arr.length; base++) {
    const a = arr.slice(0, base)
    for (let i = base; i < arr.length; i++) {
      result.push(a.concat(arr[i]!))
    }
  }
  return result
}

export const resolveFirstField = (
  path: ResolvingPath,
  field: ResolvedField,
): ResolvingPath[] => {
  let replaced = false
  let index = 0
  const fullPath: ResolvingPath = []
  for (const i in path) {
    const value = path[i]!
    if (!replaced && isField(value)) {
      fullPath.push(field)
      replaced = true
      index = Number(i)
      continue
    }
    fullPath.push(value)
  }
  return splitOnIndex(fullPath, index)
}

export const explode = (path: ResolvingPath, stats: Stats): ResolvingPath[] => {
  const res: ResolvingPath[] = []
  for (const [field, chance] of Object.entries(stats)) {
    if (chance === 0) continue
    res.push(
      ...resolveFirstField(path, {
        field: field as Field,
        chance: chance,
      }),
    )
  }
  return res
}
export const resolvePath = (
  path: ResolvingPath,
  profile: Profile,
  score: number,
): number => {
  if (isResolved(path)) {
    return pathChance(path)
  }

  const target = path.find(isField)!
  const stats = profile.hitRates[target].stats
  return explode(path, stats)
    .filter((p) => isCheckout(p, score))
    .flatMap((p) => resolvePath(p, profile, score))
    .reduce((a: number, b: number) => a + b)
}

const pathProbability: typeof resolvePath = (path, profile, score) => {
  const cached = getCache(path)
  if (cached !== undefined) return cached

  if (isResolved(path)) {
    const chance = pathChance(path)
    cache.set(JSON.stringify(path), chance)
    return chance
  }

  const target = path.find(isField)!
  const stats = profile.hitRates[target].stats
  let sum = 0
  for (const p of explode(path, stats)) {
    if (!isCheckout(p, score)) continue
    sum += pathProbability(p, profile, score)
  }
  cache.set(JSON.stringify(path), sum)
  return sum
}

export const getBestCheckout = (
  score: number,
  profile: Profile,
  darts = 3,
): Path => {
  let bestPath: Path = []
  let maxChance = 0
  for (const path of getCheckouts(score)) {
    if (path.length > darts) continue
    const chance = resolvePath(path, profile, score)
    if (chance > maxChance) {
      bestPath = path
      maxChance = chance
    }
  }
  return bestPath
}
export const getBestCheckout2: typeof getBestCheckout = (
  score,
  profile,
  darts = 3,
) => {
  cache.clear()
  let bestPath: Path = []
  let maxChance = 0
  for (const path of getCheckouts(score)) {
    if (path.length > darts) continue
    const chance = calculatePathProbability(score, path, profile.hitRates)
    if (chance > maxChance) {
      bestPath = path
      maxChance = chance
    }
  }
  return bestPath
}
function calculatePathProbability(
  startScore: number,
  path: Field[],
  accuracyMatrix: Profile['hitRates'],
): number {
  function recurse(remainingScore: number, dartIndex: number): number {
    if (dartIndex >= path.length) {
      return 0 // Used all darts without finishing
    }

    const targetField = path[dartIndex]!
    const hitProbabilities = accuracyMatrix[targetField].stats

    if (!hitProbabilities) {
      return 0 // Invalid target field
    }

    let totalProbability = 0

    // Consider all possible outcomes when aiming at targetField
    for (const [hitField, hitProb] of Object.entries(hitProbabilities)) {
      if (hitProb === 0) continue

      const newScore = remainingScore - fieldToScore(hitField as Field)

      // Check if this is a valid checkout
      if (newScore === 0 && hitField.startsWith('D')) {
        totalProbability += hitProb
      } // Check for bust conditions
      else if (
        newScore < 0 || newScore === 1 ||
        (newScore === 0 && !hitField.startsWith('D'))
      ) {
        // Bust - contributes 0 probability
        continue
      } // Score still remaining, try next dart
      else if (newScore > 1) {
        totalProbability += hitProb * recurse(newScore, dartIndex + 1)
      }
    }

    return totalProbability
  }

  return recurse(startScore, 0)
}
