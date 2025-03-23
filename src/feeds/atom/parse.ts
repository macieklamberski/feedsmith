import { parser } from './config'
import type { Feed } from './types'
import { retrieveFeed } from './utils'

export const parse = (value: string): Feed | undefined => {
  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  return parsed
}
