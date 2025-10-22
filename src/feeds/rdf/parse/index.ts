import { locales, namespaceUris } from '../../../common/config.js'
import type { DeepPartial } from '../../../common/types.js'
import { createNamespaceNormalizator } from '../../../common/utils.js'
import { detectRdfFeed } from '../../../index.js'
import type { Rdf } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Rdf.Feed<string>> => {
  if (!detectRdfFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespaceUris.rdf[0])

  const object = parser.parse(value)
  const normalized = normalizeNamespaces(object)
  const parsed = retrieveFeed(normalized)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
