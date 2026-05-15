import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import type { JsonFeed } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<JsonFeed.Feed<DateLike>, JsonFeed.Feed<Date, true>> = (
  value,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.invalidInputJson)
  }

  return generated
}
