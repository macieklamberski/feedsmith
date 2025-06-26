import type { Feed } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate = (value: Feed<Date>): unknown => {
  return generateFeed(value)
}
