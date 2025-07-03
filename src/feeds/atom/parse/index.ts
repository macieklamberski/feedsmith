import { locales } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { createCustomParser } from '../../../common/utils.js'
import { detectAtomFeed } from '../../../index.js'
import type { Feed } from '../common/types.js'
import { parserConfig } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Feed<string>> => {
  if (!detectAtomFeed(value)) {
    throw new Error(locales.invalid)
  }

  const parser = createCustomParser(parserConfig)
  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
