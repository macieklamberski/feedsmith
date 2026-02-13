import { locales } from '../../common/config.js'
import type { DateLike, GenerateMainXmlOptions } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { GenerateMainOptions, Opml } from '../common/types.js'
import { builder } from './config.js'
import { generateDocument } from './utils.js'

export const generate = <TExtra extends ReadonlyArray<string> = [], S extends boolean = false>(
  value: S extends true ? Opml.Document<Date, TExtra, true> : Opml.Document<DateLike, TExtra>,
  options?: GenerateMainXmlOptions<GenerateMainOptions<TExtra>, S>,
): string => {
  const generated = generateDocument(value, options)

  if (!generated) {
    throw new Error(locales.invalidInputOpml)
  }

  return generateXml(builder, generated, options)
}
