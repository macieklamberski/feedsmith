import type { DateLike } from '@/common/types.js'
import type { Feed } from '@/feeds/json/common/types.js'
import { generateFeed } from './utils.js'

export const generate = (value: Feed<DateLike>): unknown => {
  return generateFeed(value)
}
