import { locales } from '../../common/config.js'
import type { DateLike, XmlGenerateOptions } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { MainOptions, Opml } from '../common/types.js'
import { builder } from './config.js'
import { generateDocument } from './utils.js'

export const generate = <A extends ReadonlyArray<string> = [], S extends boolean = false>(
  value: S extends true ? Opml.Document<Date, A, true> : Opml.Document<DateLike, A>,
  options?: XmlGenerateOptions<MainOptions<A>, S>,
): string => {
  const generated = generateDocument(value as Opml.Document<DateLike, A>, options)

  if (!generated) {
    throw new Error(locales.invalidInputOpml)
  }

  return generateXml(builder, generated, options)
}
