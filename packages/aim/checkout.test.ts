import { expect } from '@std/expect'
import { Field } from 'types/board.ts'
import { randomProfile, randomStats } from '../player/profile.ts'
import { explode, resolvePath, splitOnIndex } from './checkout.ts'
import { isResolvedField, type Path, type ResolvingPath } from './path.ts'

Deno.test('splitOnIndex - Length: 3 | Index: 0', () => {
  expect(splitOnIndex([1, 2, 3], 0)).toEqual([
    [1],
    [1, 2],
    [1, 3],
    [1, 2, 3],
  ])
})
Deno.test('splitOnIndex - Length: 3 | Index: 1', () => {
  expect(splitOnIndex([1, 2, 3], 1)).toEqual([
    [1, 2],
    [1, 2, 3],
  ])
})
Deno.test('splitOnIndex - Length: 3 | Index: 2', () => {
  expect(splitOnIndex([1, 2, 3], 2)).toEqual([
    [1, 2, 3],
  ])
})
Deno.test('splitOnIndex - Length: 2 | Index: 0', () => {
  expect(splitOnIndex([1, 2], 0)).toEqual([
    [1],
    [1, 2],
  ])
})
Deno.test('splitOnIndex - Length: 2 | Index: 1', () => {
  expect(splitOnIndex([1, 2], 1)).toEqual([
    [1, 2],
  ])
})
Deno.test('splitOnIndex - Length: 1 | Index: 0', () => {
  expect(splitOnIndex([1], 0)).toEqual([
    [1],
  ])
})
Deno.test('explode first', () => {
  const stats = randomStats()
  const path: ResolvingPath = ['1', '2', '3']
  const result = explode(path, stats)
  expect(result.every(([first, ..._]) => isResolvedField(first))).toBe(true)
  // @ts-expect-error i know what i'm doing
  expect(result.map(([first, ..._]) => first.field)).toEqual(
    // @ts-expect-error i know what i'm doing
    expect.arrayContaining(Field),
  )
})
Deno.test('explode third', () => {
  const stats = randomStats()
  const path: ResolvingPath = [{ field: '1', chance: 0.1 }, {
    field: '1',
    chance: 0.1,
  }, '3']
  const result = explode(path, stats)
  expect(result.every(([_, second, ..._rest]) => isResolvedField(second))).toBe(
    true,
  )
})
Deno.test('explode second', () => {
  const stats = randomStats()
  const path: ResolvingPath = [{ field: '1', chance: 0.1 }, '2', '3']
  const result = explode(path, stats)
  expect(result.every(([_, second, ..._rest]) => isResolvedField(second))).toBe(
    true,
  )
})
Deno.test('explode short', () => {
  const stats = randomStats()
  const path: ResolvingPath = [{ field: '1', chance: 0.1 }, '2']
  const result = explode(path, stats)
  expect(result.every((p) => p.length === 2)).toBe(true)
})
Deno.test('resolvePath - [D1]', () => {
  const profile = randomProfile()
  const path: Path = ['D1']
  const result = resolvePath(path, profile, 2)
  expect(result).toBe(profile.hitRates['D1'].stats['D1'])
  expect(result).toBeLessThanOrEqual(1)
  expect(result).toBeGreaterThanOrEqual(0)
})

Deno.test('resolvePath - [1, D1]', () => {
  const profile = randomProfile()
  const path: Path = ['1', 'D1']
  const result = resolvePath(path, profile, 3)
  expect(result).toBe(
    profile.hitRates['1'].stats['1'] * profile.hitRates['D1'].stats['D1'],
  )
  expect(result).toBeLessThanOrEqual(1)
  expect(result).toBeGreaterThanOrEqual(0)
})
Deno.test('resolvePath - [1, 1, D1]', () => {
  const profile = randomProfile()
  const path: Path = ['1', '1', 'D1']
  const result = resolvePath(path, profile, 4)
  expect(result).toBe(
    profile.hitRates['1'].stats['1'] *
        profile.hitRates['1'].stats['1'] *
        profile.hitRates['D1'].stats['D1'] +
      profile.hitRates['1'].stats['2'] *
        profile.hitRates['D1'].stats['D1'] +
      profile.hitRates['1'].stats['D1'] *
        profile.hitRates['D1'].stats['D1'] +
      profile.hitRates['1'].stats['D2'],
  )
  expect(result).toBeLessThanOrEqual(1)
  expect(result).toBeGreaterThanOrEqual(0)
})
