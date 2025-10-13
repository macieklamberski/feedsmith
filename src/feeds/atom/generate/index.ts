import { locales } from '../../../common/config.js'
import type { DateLike, DeepPartial, XmlGenerateMain } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Feed } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: XmlGenerateMain<Feed<Date>, DeepPartial<Feed<DateLike>>> = (
  value,
  options,
) => {
  const generated = generateFeed(value as Feed<DateLike>)

  if (!generated) {
    throw new Error(locales.invalidInputAtom)
  }

  return generateXml(builder, generated, options)
}
