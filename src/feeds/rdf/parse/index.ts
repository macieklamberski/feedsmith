import { locales, namespacePrefixes, namespaceUris } from '../../../common/config.js'
import { DetectError, ParseError } from '../../../common/error.js'
import type { ParseOptions } from '../../../common/types.js'
import { createNamespaceNormalizator, validateXml } from '../../../common/utils.js'
import { detectRdfFeed } from '../../../index.js'
import type { Rdf } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = (value: unknown, options?: ParseOptions): Rdf.Feed<string> => {
  if (!detectRdfFeed(value)) {
    throw new DetectError(locales.invalidFeedFormat)
  }

  try {
    const normalizeNamespaces = createNamespaceNormalizator(namespaceUris, namespacePrefixes, 'rdf')
    const object = parser.parse(value)
    const normalized = normalizeNamespaces(object)
    const parsed = retrieveFeed(normalized, options)

    if (!parsed) {
      throw new ParseError(locales.invalidFeedFormat)
    }

    return parsed
  } catch {
    if (options?.detailedErrors) {
      validateXml(value)
    }
    throw new ParseError(locales.invalidFeedFormat)
  }
}
