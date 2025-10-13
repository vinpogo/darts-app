import { expect } from '@std/expect'
import { nextTick } from 'vue'
import { useUndoRef } from './undoRef.ts'

Deno.test('primitive', async () => {
  const { theRef: a, undo, canUndo } = useUndoRef(12)
  a.value = 23
  await nextTick()
  expect(canUndo.value).toBe(true)
  expect(a.value).toBe(23)
  undo()
  await nextTick()
  expect(canUndo.value).toBe(false)
  expect(a.value).toBe(12)
})
Deno.test('array', async () => {
  const { theRef: a, undo, canUndo } = useUndoRef([12])
  a.value.push(23)
  await nextTick()
  await nextTick()
  await nextTick()
  expect(a.value).toEqual([12, 23])
  expect(canUndo.value).toBe(true)
  undo()
  await nextTick()
  expect(canUndo.value).toBe(false)
  expect(a.value).toEqual([12])
})
