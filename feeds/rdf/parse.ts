import { parser } from './common'
import { feed } from './schemas'
import type { Feed } from './types'
import { parseFeed } from './utils'

export type Parse = (value: string | Buffer) => Feed | undefined

export const parse: Parse = (value) => {
  const object = parser.parse(value)
  const parsed = parseFeed(object)

  return parsed
}
