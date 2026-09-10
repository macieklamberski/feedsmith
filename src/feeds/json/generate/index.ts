import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import type { Json } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<Json.Feed<DateLike>, Json.Feed<Date, true>> = (value) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.invalidInputJson)
  }

  return generated
}
