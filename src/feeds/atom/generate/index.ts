import { GenerateError } from '../../../common/errors.js'
import type { DateLike, GenerateMainXml } from '../../../common/types.js'
import { generateXml } from '../../../common/utils.js'
import locales from '../../../locales.json' with { type: 'json' }
import type { AtomFeed } from '../common/types.js'
import { builder } from './config.js'
import { generateFeed } from './utils.js'

export const generate: GenerateMainXml<AtomFeed.Feed<DateLike>, AtomFeed.Feed<Date, true>> = (
  value,
  options,
) => {
  const generated = generateFeed(value)

  if (!generated) {
    throw new GenerateError(locales.errors.invalidInputAtom)
  }

  return generateXml(builder, generated, options)
}
