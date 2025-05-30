import { parser } from './config.js'
import { parseOpml } from './utils.js'

export const parse = (value: string) => {
  const object = parser.parse(value)
  const parsed = parseOpml(object)

  if (!parsed) {
    throw new Error('Invalid OPML format')
  }

  return parsed
}
