import { locales, namespacePrefixes, namespaceUris } from '../../../common/config.js'
import type { DeepPartial, ParseOptions } from '../../../common/types.js'
import { createNamespaceNormalizator } from '../../../common/utils.js'
import { detectRssFeed } from '../../../index.js'
import type { Rss } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown, options?: ParseOptions): DeepPartial<Rss.Feed<string>> => {
  if (!detectRssFeed(value)) {
    throw new Error(locales.invalidFeedFormat)
  }

  const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes)

  const object = parser.parse(value)
  const normalized = normalizeNamespaces(object)
  const parsed = retrieveFeed(normalized, options)

  if (!parsed) {
    throw new Error(locales.invalidFeedFormat)
  }

  return parsed
}
