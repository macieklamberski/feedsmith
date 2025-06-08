import { locales } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { detectRdfFeed } from '../../../index.js'
import type { Feed } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Feed<string>> => {
  if (!detectRdfFeed(value)) {
    throw new Error(locales.invalid)
  }

  const object = parser.parse(value)
  const parsed = retrieveFeed(object)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
