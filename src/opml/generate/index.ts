import { locales } from '../../common/config.js'
import type { DateLike, XmlGenerateOptions } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { MainOptions, Opml } from '../common/types.js'
import { builder } from './config.js'
import { generateDocument } from './utils.js'

export const generate = <A extends ReadonlyArray<string> = []>(
  value: Opml.Document<DateLike, A>,
  options?: XmlGenerateOptions<MainOptions<A>>,
): string => {
  const generated = generateDocument(value, options)

  if (!generated) {
    throw new Error(locales.invalidInputOpml)
  }

  return generateXml(builder, generated, options)
}
