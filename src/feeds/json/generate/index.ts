import type { Feed } from './types'
import { generateFeed } from './utils'

export const generate = (value: Feed): unknown => {
  return generateFeed(value)
}
