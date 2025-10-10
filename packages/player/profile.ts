import { Field, Miss } from '../types/board.ts'

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
  Array.from(Array(179)).reduce((res, _, i) => {
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
