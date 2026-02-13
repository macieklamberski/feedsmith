import { locales } from '../../../common/config.js'
import type { DateLike, GenerateMainXml } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import type { Atom } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainXml<Atom.Feed<DateLike>, Atom.Feed<Date, true>> = (
  value,
  options,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new Error(locales.invalidInputAtom)
  }

  return generateXml(builder, generated, options)
}
