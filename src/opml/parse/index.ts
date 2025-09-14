import type { DeepPartial } from '../../common/types.js'
import type { Opml, Options } from '../common/types.js'
import { parser } from './config.js'
import { parseOpml } from './utils.js'

export const parse = (value: string, options?: Options): DeepPartial<Opml<string>> => {
  const object = parser.parse(value)
  const parsed = parseOpml(object, options)

  if (!parsed) {
    throw new Error('Invalid OPML format')
  }

  return parsed
}
