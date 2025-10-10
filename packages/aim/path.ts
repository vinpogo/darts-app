import { Field, fieldToScore } from 'types/board.ts'
import { getCheckouts } from './checkout.ts'

export type Path = Field[]
export type ResolvedField = { field: Field; chance: number }
export type ResolvingPath = (ResolvedField | Field)[]
export type ResolvedPath = ResolvedField[]

export const isResolvedField = (field: unknown): field is ResolvedField =>
  typeof field === 'object' &&
  field !== null &&
  'field' in field &&
  'chance' in field
export const isResolved = (path: ResolvingPath): path is ResolvedPath =>
  path.every(isResolvedField)
export const pathChance = (path: ResolvedPath): number =>
  path.reduce((sum, field) => sum * field.chance, 1)
export const pathScore = (path: ResolvingPath) =>
  path.map((field) =>
    isResolvedField(field) ? fieldToScore(field.field) : fieldToScore(field)
  ).reduce((a: number, b: number) => a + b)
const toField = (field: ResolvedField | Field): Field =>
  isResolvedField(field) ? field.field : field
const arePathsEqual = (a: ResolvingPath, b: ResolvingPath) => {
  if (a.length !== b.length) return false
  for (const i in a) {
    if (toField(a[i]!) !== toField(b[i]!)) return false
  }
  return true
}
export const isPossible = (path: ResolvingPath, target: number): boolean =>
  getCheckouts(target).some((p) => arePathsEqual(path, p))
