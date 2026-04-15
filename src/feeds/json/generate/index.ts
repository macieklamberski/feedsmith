import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import type { ExtraFieldNames, GeneratePartialOptions, Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<
  Json.Feed<DateLike, false, ExtraFieldNames>,
  Json.Feed<Date, true, ExtraFieldNames>,
  GeneratePartialOptions<ExtraFieldNames>
> = (value, options) => {
  const generated = generateFeed(value as Json.Feed<DateLike, false, ExtraFieldNames>, options)

  if (!generated) {
    throw new GenerateError(locales.invalidInputJson)
  }

  return generated
}
