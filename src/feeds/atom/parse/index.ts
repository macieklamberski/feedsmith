import { locales } from '../../../common/config.js'
import type { DeepPartial, ParseOptions } from '../../../common/types.js'
import { detectAtomFeed } from '../../../index.js'
import type { Atom } from '../common/types.js'
import { normalizeNamespaces, parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown, options?: ParseOptions): DeepPartial<Atom.Feed<string>> => {
  if (!detectAtomFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const object = parser.parse(value)
  const normalized = normalizeNamespaces(object)
  const parsed = retrieveFeed(normalized, options)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
