import type { DateLike, JsonGenerateMain } from '../../../common/types.js'
import type { Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: JsonGenerateMain<Json.Feed<DateLike>> = (value) => {
  return generateFeed(value)
}
