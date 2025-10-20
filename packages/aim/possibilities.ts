import type { Field } from 'types/board.ts'
import { splitArray } from '../packages/helpers/array.ts'

const scoringTable: Record<Exclude<Field, '0'>, number> = {
  1: 1,
  D1: 2,
  T1: 3,
  2: 2,
  D2: 4,
  T2: 6,
  3: 3,
  D3: 6,
  T3: 9,
  4: 4,
  D4: 8,
  T4: 12,
  5: 5,
  D5: 10,
  T5: 15,
  6: 6,
  D6: 12,
  T6: 18,
  7: 7,
  D7: 14,
  T7: 21,
  8: 8,
  D8: 16,
  T8: 24,
  9: 9,
  D9: 18,
  T9: 27,
  10: 10,
  D10: 20,
  T10: 30,
  11: 11,
  D11: 22,
  T11: 33,
  12: 12,
  D12: 24,
  T12: 36,
  13: 13,
  D13: 26,
  T13: 39,
  14: 14,
  D14: 28,
  T14: 42,
  15: 15,
  D15: 30,
  T15: 45,
  16: 16,
  D16: 32,
  T16: 48,
  17: 17,
  D17: 34,
  T17: 51,
  18: 18,
  D18: 36,
  T18: 54,
  19: 19,
  D19: 38,
  T19: 57,
  20: 20,
  D20: 40,
  T20: 60,
  Bull: 25,
  DBull: 50,
}

const fields = Object.keys(scoringTable) as Field[]

const checkoutScores = Array.from({ length: 170 }).map((_, i) => i + 1)

const rest = (score: number, darts: Field[]): number => {
  return darts.reduce((res, dart) => res - scoringTable[dart], score)
}

type TargetCriteria = (darts: Field[], from: number, to: number) => boolean
const checkout: TargetCriteria = (darts, score) =>
  rest(score, darts) === 0 && !!darts.at(-1)?.startsWith('D')
const exact: TargetCriteria = (darts, from, to) => rest(from, darts) === to

const isPathValid = (
  path: Field[],
  from: number,
  to: number,
  matcher: TargetCriteria,
) => {
  const r = rest(from, path)
  if (r < to) return false
  if (matcher(path, from, to)) return true
  return path.length < 3
}

const initialPossiblities = (
  from: number,
  to: number,
  matcher: TargetCriteria,
): Field[][] => {
  return fields
    .filter((field) => isPathValid([field], from, to, matcher))
    .map((field) => [field])
}

export const getCheckoutsForScore = (from: number, to: number): Field[][] => {
  const matcher = to === 0 ? checkout : exact
  const getFinishedAndOpens = (paths: Field[][]) =>
    splitArray(paths, (path) => matcher(path, from, to))

  const afterFirstDart = initialPossiblities(from, to, matcher)
  const [oneDartFinishes, openAfterFirstDart] = getFinishedAndOpens(
    afterFirstDart,
  )
  const afterSecondDart = openAfterFirstDart
    .flatMap((path) => fields.map((field) => [...path, field]))
    .filter((path) => isPathValid(path, from, to, matcher))
  const [twoDartFinished, openAfterSecondDart] = getFinishedAndOpens(
    afterSecondDart,
  )
  const afterThirdDart = openAfterSecondDart
    .flatMap((path) => fields.map((field) => [...path, field]))
    .filter((path) => isPathValid(path, from, to, matcher))
  const [threeDartFinished, _] = getFinishedAndOpens(afterThirdDart)
  return [...oneDartFinishes, ...twoDartFinished, ...threeDartFinished]
}

export const getAllCheckouts = () =>
  checkoutScores.reduce((res, score) => {
    res[score] = getCheckoutsForScore(score, 0)
    return res
  }, {} as Record<number, Field[][]>)

// console.log(getAllCheckouts())

// Deno.writeTextFile(
//   'packages/aim/possibilities.json',
//   JSON.stringify(getAllCheckouts(), null, 2),
// )
// console.log(JSON.stringify(getAllPossibilities()));
console.log(getCheckoutsForScore(100, 0))
