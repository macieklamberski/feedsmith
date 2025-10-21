import { locales } from '../../common/config.js'
import type { DateLike, DeepPartial, XmlGenerateOptions } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { Document, MainOptions } from '../common/types.js'
import { builder } from './config.js'
import { generateDocument } from './utils.js'

export const generate = <A extends ReadonlyArray<string> = [], F extends boolean = false>(
  value: F extends true ? DeepPartial<Document<DateLike, A>> : Document<Date, A>,
  options?: XmlGenerateOptions<MainOptions<A>, F>,
): string => {
  const generated = generateDocument(value as Document<DateLike, A>, options)

  if (!generated) {
    throw new Error(locales.invalidInputOpml)
  }

  return generateXml(builder, generated, options)
}
