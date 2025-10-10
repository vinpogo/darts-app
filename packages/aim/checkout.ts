import { Field, isField } from 'types/board.ts'
import type { Stats } from '../../shared/playerProfile.ts'
import type { Profile } from '../player/profile.ts'
import {
  isPossible,
  isResolved,
  type Path,
  pathChance,
  type ResolvedField,
  type ResolvingPath,
} from './path.ts'
import possibilities from './possibilities.json' with { type: 'json' }

export const getCheckouts = (score: number): Field[][] =>
  // @ts-expect-error stupid json
  possibilities[String(score)]

export const splitOnIndex = <T>(arr: T[], idx: number): T[][] => {
  const result: T[][] = [arr.slice(0, idx + 1)]
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

export const explode = (path: ResolvingPath, stats: Stats): ResolvingPath[] =>
  Object.entries(stats).reduce<ResolvingPath[]>((res, [field, chance]) => {
    const resolved = resolveFirstField(path, {
      field: field as Field,
      chance,
    })
    res.push(...resolved)
    return res
  }, [])

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
  const exploded = explode(path, stats)
  const filtered = exploded
    .filter((p) => isPossible(p, score))
  const allPaths = filtered
    .flatMap((p) => resolvePath(p, profile, score))
  return allPaths
    .reduce((a: number, b: number) => a + b)
}

export const getBestCheckout = (score: number, profile: Profile): Path =>
  getCheckouts(score)
    .map((path) => ({
      path,
      chance: resolvePath(path, profile, score),
    }))
    .sort((optionA, optionB) => optionA.chance > optionB.chance ? 1 : -1)[0]
    ?.path ?? []
