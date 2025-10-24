import { Schema } from 'effect'
import { ParseError } from 'effect/ParseResult'
import { validator } from 'hono/validator'

export const schemaValidator = <A, I>(
  target: Parameters<typeof validator>[0],
  schema: Schema.Schema<A, I>,
) =>
  validator(target, (value, c) => {
    try {
      const result = Schema.decodeUnknownSync(schema)(value)
      return result
    } catch (e) {
      if (e instanceof ParseError) {
        return c.text(e.message, 400)
      }
      throw e
    }
  })
