import { locales } from '../../common/config.js'
import type { DeepPartial } from '../../common/types.js'
import type { MainOptions, Opml } from '../common/types.js'
import { parser } from './config.js'
import { parseDocument } from './utils.js'

export const parse = <const A extends ReadonlyArray<string> = ReadonlyArray<string>>(
  value: string,
  options?: MainOptions<A>,
): DeepPartial<Opml.Document<string, A>> => {
  const object = parser.parse(value)
  const parsed = parseDocument(object, options)

  if (!parsed) {
    throw new Error(locales.invalidOpmlFormat)
  }

  return parsed as DeepPartial<Opml.Document<string, A>>
}
