import { parser } from './config.js'
import type { Opml } from './types.js'
import { parseOpml } from './utils.js'

export const parse = (value: string): Opml => {
  const object = parser.parse(value)
  const parsed = parseOpml(object)

  if (!parsed) {
    throw new Error('Invalid OPML format')
  }

  return parsed
}
