import type { DateLike, JsonGenerateMain } from '../../../common/types.js'
import type { ExtraFieldNames, Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export type GenerateOptions<TExtra extends ExtraFieldNames = []> = {
  extraFields?: TExtra
}

export const generate: JsonGenerateMain<
  Json.Feed<DateLike, false, ExtraFieldNames>,
  Json.Feed<Date, true, ExtraFieldNames>,
  GenerateOptions<ExtraFieldNames>
> = (value, options) => {
  return generateFeed(value as Json.Feed<DateLike, false, ExtraFieldNames>, options?.extraFields)
}
