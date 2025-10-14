import { NotOk, Ok, type Result } from '@untier/result'

const db = await Deno.openKv('./db')

export class KvWriteError extends Error {}
export class KvReadError extends Error {}

export const set = async <T>(
  key: string[],
  value: T,
): Promise<Result<T, KvWriteError>> => {
  console.log('setting', key, value)
  const res = await db.set(key, value)
  if (res.ok) return new Ok(value)
  return new NotOk(new KvWriteError('something went wrong!'))
}

export const get = async <T>(
  key: string[],
): Promise<Result<T, KvReadError>> => {
  const res = await db.get<T>(key)
  if (res.value) return new Ok(res.value)
  return new NotOk(new KvReadError(`No entry with key: ${key}!`))
}
