import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainXml } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { RssFeed } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainXml<RssFeed.Feed<DateLike>, RssFeed.Feed<Date, true>> = (
  value,
  options,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.invalidInputRss)
  }

  return generateXml(builder, generated, options)
}
