import type { DateLike, DeepPartial, JsonGenerateFunction } from '../../../common/types.js'
import type { Feed } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: JsonGenerateFunction<Feed<Date>, DeepPartial<Feed<DateLike>>> = (value) => {
  return generateFeed(value as Feed<Date | DateLike>)
}
