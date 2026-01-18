import { locales } from '../../common/config.js'
import { ParseError } from '../../common/error.js'
import { validateXml } from '../../common/utils.js'
import type { MainOptions, Opml } from '../common/types.js'
import { parser } from './config.js'
import { parseDocument } from './utils.js'

export const parse = <const A extends ReadonlyArray<string> = ReadonlyArray<string>>(
  value: string,
  options?: MainOptions<A>,
): Opml.Document<string, A> => {
  try {
    const object = parser.parse(value)
    const parsed = parseDocument(object, options)

    if (!parsed) {
      throw new ParseError(locales.invalidOpmlFormat)
    }

    return parsed
  } catch {
    if (options?.detailedErrors) {
      validateXml(value)
    }
    throw new ParseError(locales.invalidOpmlFormat)
  }
}
