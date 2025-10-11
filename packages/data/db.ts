import { NotOk, Ok, type Result } from '@untier/result'

const db = await Deno.openKv()

export const set = async <T>(
  key: string[],
  value: T,
): Promise<Result<T, undefined>> => {
  const res = await db.set(key, value)
  if (res.ok) return new Ok(value)
  return new NotOk(undefined)
}

export const get = async <T>(key: string[]): Promise<Result<T, undefined>> => {
  const res = await db.get<T>(key)
  if (res.value) return new Ok(res.value)
  return new NotOk(undefined)
}
