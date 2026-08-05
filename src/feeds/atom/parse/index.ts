import { XMLParser } from 'fast-xml-parser'
import { locales, namespacePrefixes, namespaceUris, parserConfig } from '../../../common/config.js'
import { DetectError, MalformedError, ParseError } from '../../../common/errors.js'
import type { ParseMainOptions, Unreliable } from '../../../common/types.js'
import { createNamespaceResolver } from '../../../common/utils.js'
import { detectAtomFeed } from '../../../index.js'
import type { AtomFeed } from '../common/types.js'
import { stopNodes } from './config.js'
import { retrieveFeed } from './utils.js'

const createNamespaceOptions = createNamespaceResolver({
  namespaceUris,
  namespacePrefixes,
  primaryNamespaces: ['atom'],
})

// Replaced per document, so the hooks below always read the declarations of the feed
// being parsed and nothing survives into the next one.
let namespaceOptions = createNamespaceOptions()

const parser = new XMLParser({
  ...parserConfig,
  stopNodes,
  transformTagName: (name) => namespaceOptions.transformTagName(name),
  transformAttributeName: (name) => namespaceOptions.transformAttributeName(name),
  attributeValueProcessor: (name, value) => namespaceOptions.attributeValueProcessor(name, value),
  updateTag: (name) => namespaceOptions.updateTag(name),
})

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): AtomFeed.Feed<TDate> => {
  if (!detectAtomFeed(value)) {
    throw new DetectError(locales.invalidFeedFormat)
  }

  let normalized: Unreliable

  try {
    namespaceOptions = createNamespaceOptions()
    normalized = parser.parse(value)
  } catch (error) {
    throw new MalformedError(locales.invalidFeedFormat, { cause: error })
  }

  const parsed = retrieveFeed(normalized, options)

  if (!parsed) {
    throw new ParseError(locales.invalidFeedFormat)
  }

  return parsed as AtomFeed.Feed<TDate>
}
