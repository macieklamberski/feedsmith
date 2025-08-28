import type { DateLike, DeepPartial, XmlGenerateFunction } from '@/common/types.js'
import { generateXml } from '@/common/utils.js'
import type { Opml } from '@/opml/common/types.js'
import { builder } from './config.js'
import { generateOpml } from './utils.js'

export const generate: XmlGenerateFunction<Opml<Date>, DeepPartial<Opml<DateLike>>> = (
  value,
  options,
) => {
  const generated = generateOpml(value as Opml<DateLike>)

  if (!generated) {
    throw new Error('Invalid input OPML')
  }

  return generateXml(builder, generated, options)
}
