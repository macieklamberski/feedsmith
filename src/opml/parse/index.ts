import type { DeepPartial } from '../../common/types.js'
import { createCustomParser } from '../../common/utils.js'
import type { Opml } from '../common/types.js'
import { parserConfig } from './config.js'
import { parseOpml } from './utils.js'

export const parse = (value: string): DeepPartial<Opml<string>> => {
  const parser = createCustomParser(parserConfig)
  const object = parser.parse(value)
  const parsed = parseOpml(object)

  if (!parsed) {
    throw new Error('Invalid OPML format')
  }

  return parsed
}
