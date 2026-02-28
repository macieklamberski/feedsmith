import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import type { ExtraFieldNames, GeneratePartialOptions, Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<
  Json.Feed<DateLike, false, ExtraFieldNames>,
  Json.Feed<Date, true, ExtraFieldNames>,
  GeneratePartialOptions<ExtraFieldNames>
> = (value, options) => {
  return generateFeed(value as Json.Feed<DateLike, false, ExtraFieldNames>, options)
}
