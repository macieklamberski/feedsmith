import { locales } from '../../../common/config.js'
import { DetectError, MalformedError, ParseError } from '../../../common/errors.js'
import type { ParseMainOptions, Unreliable } from '../../../common/types.js'
import { detectRdfFeed } from '../../../index.js'
import type { RdfFeed } from '../common/types.js'
import { normalizeNamespaces, parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): RdfFeed.Feed<TDate> => {
  if (!detectRdfFeed(value)) {
    throw new DetectError(locales.invalidFeedFormat)
  }

  let normalized: Unreliable

  try {
    const object = parser.parse(value)
    normalized = normalizeNamespaces(object)
  } catch (error) {
    throw new MalformedError(locales.invalidFeedFormat, { cause: error })
  }

  const parsed = retrieveFeed(normalized, options)

  if (!parsed) {
    throw new ParseError(locales.invalidFeedFormat)
  }

  return parsed as RdfFeed.Feed<TDate>
}
