import { locales } from '../../../common/config.js'
import type { DateLike, XmlGenerateMain } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Atom } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: XmlGenerateMain<Atom.Feed<Date>, Atom.Feed<DateLike>> = (value, options) => {
  const generated = generateFeed(value as Atom.Feed<DateLike>)

  if (!generated) {
    throw new Error(locales.invalidInputAtom)
  }

  return generateXml(builder, generated, options)
}
