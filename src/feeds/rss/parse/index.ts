import { locales } from '../../../common/config.js'
import { DetectError, ParseError } from '../../../common/errors.js'
import type { ParseMainOptions, Unreliable } from '../../../common/types.js'
import { validateXml } from '../../../common/utils.js'
import { detectRssFeed } from '../../../index.js'
import type { Rss } from '../common/types.js'
import { normalizeNamespaces, parser } from './config.js'
import { retrieveFeed } from './utils.js'

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): Rss.Feed<TDate> => {
  if (!detectRssFeed(value)) {
    throw new DetectError(locales.invalidFeedFormat)
  }

  let normalized: Unreliable

  try {
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

  return parsed as Rss.Feed<TDate>
}
