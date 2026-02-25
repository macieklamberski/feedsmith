import { locales } from '../../common/config.js'
import { ParseError } from '../../common/error.js'
import type { Unreliable } from '../../common/types.js'
import { validateXml } from '../../common/utils.js'
import type { Opml, ParseMainOptions } from '../common/types.js'
import { parser } from './config.js'
import { parseDocument } from './utils.js'

export const parse = <
  TDate = string,
  const TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  value: string,
  options?: ParseMainOptions<TDate, TExtra>,
): Opml.Document<TDate, TExtra> => {
  let object: Unreliable

  try {
    object = parser.parse(value)
  } catch {
    if (options?.detailedErrors) {
      validateXml(value)
    }
    throw new ParseError(locales.invalidOpmlFormat)
  }

  const parsed = parseDocument(object, options)

  if (!parsed) {
    throw new ParseError(locales.invalidOpmlFormat)
  }

  return parsed as Opml.Document<TDate, TExtra>
}
