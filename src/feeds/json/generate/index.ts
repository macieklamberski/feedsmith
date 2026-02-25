import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import type { Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<Json.Feed<DateLike>, Json.Feed<Date, true>> = (value) => {
  return generateFeed(value)
}
