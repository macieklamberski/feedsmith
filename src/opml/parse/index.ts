import { XMLParser } from 'fast-xml-parser'
import type { DeepPartial } from '../../common/types.js'
import type { Opml } from '../common/types.js'
import { parserConfig } from './config.js'
import { parseOpml } from './utils.js'

export const parse = (value: string): DeepPartial<Opml<string>> => {
  const parser = new XMLParser(parserConfig)
  const object = parser.parse(value)
  const parsed = parseOpml(object)

  if (!parsed) {
    throw new Error('Invalid OPML format')
  }

  return parsed
}
