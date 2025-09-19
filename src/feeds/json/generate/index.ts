import type { DateLike, DeepPartial, JsonGenerateMain } from '../../../common/types.js'
import type { Feed } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: JsonGenerateMain<Feed<Date>, DeepPartial<Feed<DateLike>>> = (value) => {
  return generateFeed(value as Feed<DateLike>)
}
