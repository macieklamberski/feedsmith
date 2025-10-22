import { locales, namespaceUris } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { createNamespaceNormalizator } from '../../../common/utils.js'
import { detectAtomFeed } from '../../../index.js'
import type { Atom } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Atom.Feed<string>> => {
  if (!detectAtomFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespaceUris.atom[0])

  const object = parser.parse(value)
  const normalized = normalizeNamespaces(object)
  const parsed = retrieveFeed(normalized)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
