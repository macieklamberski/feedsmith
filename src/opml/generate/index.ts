import type { DateLike, DeepPartial, XmlStylesheet } from '../../common/types.js'
import { generateXml } from '../../common/utils.js'
import type { MainOptions, Opml } from '../common/types.js'
import { builder } from './config.js'
import { generateOpml } from './utils.js'

export const generate = <A extends ReadonlyArray<string> = [], L extends boolean = false>(
  value: L extends true ? DeepPartial<Opml<DateLike, A>> : Opml<Date, A>,
  options?: MainOptions<A> & { lenient?: L; stylesheets?: Array<XmlStylesheet> },
): string => {
  const generated = generateOpml(value as Opml<DateLike, A>, options as MainOptions<A>)

  if (!generated) {
    throw new Error('Invalid input OPML')
  }

  return generateXml(builder, generated, options)
}
