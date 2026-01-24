import type { DateLike, JsonGenerateMain } from '../../../common/types.js'
import type { Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: JsonGenerateMain<Json.Feed<DateLike>, Json.Feed<Date, true>> = (value) => {
  return generateFeed(value as Json.Feed<DateLike>)
}
