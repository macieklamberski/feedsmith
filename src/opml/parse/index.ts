import { locales } from '../../common/config.js'
import type { DeepPartial } from '../../common/types.js'
import type { MainOptions, Opml } from '../common/types.js'
import { parser } from './config.js'
import { parseOpml } from './utils.js'

export const parse = <const A extends ReadonlyArray<string> = []>(
  value: string,
  options?: MainOptions<A>,
): DeepPartial<Opml<string, A>> => {
  const object = parser.parse(value)
  const parsed = parseOpml(object, options)

  if (!parsed) {
    throw new Error(locales.invalidOpmlFormat)
  }

  return parsed as DeepPartial<Opml<string, A>>
}
