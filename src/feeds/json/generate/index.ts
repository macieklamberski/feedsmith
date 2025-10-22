import type { DateLike, DeepPartial, JsonGenerateMain } from '../../../common/types.js'
import type { Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: JsonGenerateMain<Json.Feed<Date>, DeepPartial<Json.Feed<DateLike>>> = (
  value,
) => {
  return generateFeed(value as Json.Feed<DateLike>)
}
