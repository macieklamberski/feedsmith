import { locales } from '../../common/config.js'
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
  const object = parser.parse(value)
  const parsed = parseDocument(object, options)

  if (!parsed) {
    throw new Error(locales.invalidOpmlFormat)
  }

  return parsed as Opml.Document<TDate, TExtra>
}
