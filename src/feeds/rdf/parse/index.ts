import { locales, namespaceUrls } from '@/common/config.js'
import type { DeepPartial } from '@/common/types.js'
import { createNamespaceNormalizator } from '@/common/utils.js'
import type { Feed } from '@/feeds/rdf/common/types.js'
import { detectRdfFeed } from '@/index.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown): DeepPartial<Feed<string>> => {
  if (!detectRdfFeed(value)) {
    throw new Error(locales.invalid)
  }

  const normalizeNamespaces = createNamespaceNormalizator(namespaceUrls, namespaceUrls.rdf)

  const object = parser.parse(value)
  const normalized = normalizeNamespaces(object)
  const parsed = retrieveFeed(normalized)

  if (!parsed) {
    throw new Error(locales.invalid)
  }

  return parsed
}
