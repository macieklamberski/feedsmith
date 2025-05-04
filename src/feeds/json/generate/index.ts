import type { Feed } from './types.js'
import { generateFeed } from './utils.js'

export const generate = (value: Feed): unknown => {
  return generateFeed(value)
}
