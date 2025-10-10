import { expect } from '@std/expect/expect'
import { ascending, descending } from './sort.ts'

Deno.test('ascending', () => {
  expect([3, 2, 1].sort(ascending((a) => a))).toEqual([1, 2, 3])
  expect(
    [{ value: 3 }, { value: 2 }, { value: 1 }].sort(ascending((a) => a.value)),
  ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }])
})
Deno.test('descending', () => {
  expect([1, 2, 3].sort(descending((a) => a))).toEqual([3, 2, 1])
  expect(
    [{ value: 1 }, { value: 2 }, { value: 3 }].sort(descending((a) => a.value)),
  ).toEqual([{ value: 3 }, { value: 2 }, { value: 1 }])
})
