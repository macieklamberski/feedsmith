import { locales } from '../../../common/config.js'
import type { DateLike, DeepPartial, XmlGenerateMain } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Rss } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: XmlGenerateMain<
  Rss.Feed<Date, Rss.PersonLike>,
  DeepPartial<Rss.Feed<DateLike, Rss.PersonLike>>
> = (value, options) => {
  const generated = generateFeed(value as Rss.Feed<DateLike, Rss.PersonLike>)

  if (!generated) {
    throw new Error(locales.invalidInputRss)
  }

  return generateXml(builder, generated, options)
}
