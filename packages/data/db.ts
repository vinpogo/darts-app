import { Effect } from 'effect'

const db = await Deno.openKv('./db')

export class KvWriteError extends Error {
  readonly _tag = 'KvWriteError'
}
export class KvReadError extends Error {
  readonly _tag = 'KvReadError'
}

export const set = <T>(
  key: string[],
  value: T,
): Effect.Effect<T, KvWriteError, never> =>
  Effect.tryPromise({
    try: async () => {
      const res = await db.set(key, value)
      if (res.ok) return value
      throw new Error()
    },
    catch: () => new KvWriteError(`Failed to write key: ${key}`),
  })

export const get = <T>(
  key: string[],
) =>
  Effect.tryPromise({
    try: async () => {
      const res = await db.get<T>(key)
      if (res.value) return res.value
      throw new Error()
    },
    catch: () => new KvReadError(`No entry with key: ${key}`),
  })
