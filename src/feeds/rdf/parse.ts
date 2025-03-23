import { parser } from './config'
import { feed } from './schemas'
import type { Feed } from './types'
import { retrieveFeed } from './utils'

export type Parse = (value: string) => Feed | undefined

export const parse: Parse = (value) => {
  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  return parsed
}
