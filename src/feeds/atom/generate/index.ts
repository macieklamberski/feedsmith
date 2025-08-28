import type { DateLike, DeepPartial, XmlGenerateFunction } from '@/common/types.js'
import { generateXml } from '@/common/utils.js'
import type { Feed } from '@/feeds/atom/common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: XmlGenerateFunction<Feed<Date>, DeepPartial<Feed<DateLike>>> = (
  value,
  options,
) => {
  const generated = generateFeed(value as Feed<DateLike>)

  if (!generated) {
    throw new Error('Invalid input Atom')
  }

  return generateXml(builder, generated, options)
}
