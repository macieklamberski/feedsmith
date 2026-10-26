import { GenerateError } from '../../common/errors.js'
import type { DateLike, GenerateMainXmlOptions } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import locales from '../../locales.json' with { type: 'json' }
import type { GenerateMainOptions, Opml } from '../common/types.js'
import { builder } from './config.js'
import { generateDocument } from './utils.js'

export const generate = <TExtra extends ReadonlyArray<string> = [], S extends boolean = false>(
  value: S extends true ? Opml.Document<Date, TExtra, true> : Opml.Document<DateLike, TExtra>,
  options?: GenerateMainXmlOptions<GenerateMainOptions<TExtra>, S>,
): string => {
  const generated = generateDocument(value, options)

  if (!generated) {
    throw new GenerateError(locales.errors.invalidInputOpml)
  }

  return generateXml(builder, generated, options)
}
