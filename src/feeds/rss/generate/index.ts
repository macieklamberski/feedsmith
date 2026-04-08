import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainXml } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Rss } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainXml<Rss.Feed<DateLike>, Rss.Feed<Date, true>> = (
  value,
  options,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.invalidInputRss)
  }

  return generateXml(builder, generated, options)
}
