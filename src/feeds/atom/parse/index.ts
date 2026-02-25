import { locales, namespacePrefixes, namespaceUris } from '../../../common/config.js'
import { DetectError, ParseError } from '../../../common/error.js'
import type { ParseMainOptions, Unreliable } from '../../../common/types.js'
import { createNamespaceNormalizator, validateXml } from '../../../common/utils.js'
import { detectAtomFeed } from '../../../index.js'
import type { Atom } from '../common/types.js'
import { parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): Atom.Feed<TDate> => {
  if (!detectAtomFeed(value)) {
    throw new DetectError(locales.invalidFeedFormat)
  }

  let normalized: Unreliable

  try {
    const normalizeNamespaces = createNamespaceNormalizator(
      namespaceUris,
      namespacePrefixes,
      'atom',
    )
    const object = parser.parse(value)
    normalized = normalizeNamespaces(object)
  } catch {
    if (options?.detailedErrors) {
      validateXml(value)
    }
    throw new ParseError(locales.invalidFeedFormat)
  }

  const parsed = retrieveFeed(normalized, options)

  if (!parsed) {
    throw new ParseError(locales.invalidFeedFormat)
  }

  return parsed as Atom.Feed<TDate>
}
