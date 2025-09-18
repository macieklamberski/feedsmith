import type { DateLike, DeepPartial, XmlGenerateMain } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { Opml, Options } from '../common/types.js'
import { builder } from './config.js'
import { generateOpml } from './utils.js'

export const generate: XmlGenerateMain<Opml<Date>, DeepPartial<Opml<DateLike>>, Options> = (
  value,
  options,
) => {
  const generated = generateOpml(value as Opml<DateLike>, options)

  if (!generated) {
    throw new Error('Invalid input OPML')
  }

  return generateXml(builder, generated, options)
}
