import { Field, Miss, possibleCheckouts } from '../types/board.ts'

export type Stats = Record<Field | Miss, number>

export type Profile = {
  hitRates: Record<Field, {
    stats: Stats
    darts: number
  }>
  checkoutChance: Record<number, { attempts: number; rate: number }>
}
export const randomStats = () => {
  let total = 0
  const includingMiss = [...Field, Miss]
  return includingMiss
    .map(() => {
      const res = Math.random()
      total += res
      return res
    }).reduce((res, chance, idx) => {
      res[includingMiss[idx]!] = chance / total
      return res
    }, {} as Stats)
}
const randomInt = () => Math.round(Math.random() * 1_000)
const randomCheckoutChance = (): Profile['checkoutChance'] =>
  Array.from(Array(170)).reduce((res, _, i) => {
    res[i + 1] = { rate: Math.random(), attempts: randomInt() }
    return res
  }, {})

export const randomProfile = (): Profile => ({
  hitRates: Field.reduce((res, field) => {
    res[field] = {
      stats: randomStats(),
      darts: randomInt(),
    }
    return res
  }, {} as Profile['hitRates']),
  checkoutChance: randomCheckoutChance(),
})

export const emptyStats = (): Stats =>
  [...Field, Miss]
    .reduce((res, field) => {
      res[field] = 0
      return res
    }, {} as Stats)

export const emptyCheckouts = (): Profile['checkoutChance'] =>
  possibleCheckouts
    .reduce((res, checkout) => {
      res[checkout] = { attempts: 0, rate: 1 }
      return res
    }, {} as Profile['checkoutChance'])
export const emptyProfile = (): Profile => ({
  hitRates: Field.reduce((res, field) => {
    res[field] = {
      stats: emptyStats(),
      darts: 0,
    }
    return res
  }, {} as Profile['hitRates']),
  checkoutChance: emptyCheckouts(),
})

export const upsertField = (
  hitRates: Profile['hitRates'][Field],
  field: Field,
): Profile['hitRates'][Field] => {
  const clone = structuredClone(hitRates)

  const oldDarts = clone.darts
  const newDarts = clone.darts + 1
  const newStats = Object.entries(clone.stats)
    .reduce((res, [f, chance]) => {
      const darts = chance * oldDarts + Number(field === f)
      res[f as (Field | Miss)] = darts / newDarts
      return res
    }, {} as Stats)
  return {
    stats: newStats,
    darts: newDarts,
  }
}
