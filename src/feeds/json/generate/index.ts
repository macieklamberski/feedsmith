import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainJson } from '../../../common/types.js'
import locales from '../../../locales.json' with { type: 'json' }
import type { JsonFeed } from '../common/types.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainJson<JsonFeed.Feed<DateLike>, JsonFeed.Feed<Date, true>> = (
  value,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.errors.invalidInputJson)
  }

  return generated
}
