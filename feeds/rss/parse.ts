import { parser } from './common'
import type { Feed } from './types'
import { retrieveFeed } from './utils'

export type Parse = (value: string | Buffer) => Feed | undefined

export const parse: Parse = (value) => {
  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  return parsed
}
