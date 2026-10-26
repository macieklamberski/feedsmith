import { DetectError, ParseError } from '../../../common/errors.js'
import type { ParseMainOptions } from '../../../common/types.js'
import { parseJsonObject } from '../../../common/utils.js'
import { detectJsonFeed } from '../../../index.js'
import locales from '../../../locales.json' with { type: 'json' }
import type { JsonFeed } from '../common/types.js'
import { parseFeed } from './utils.js'

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): JsonFeed.Feed<TDate> => {
  const json = parseJsonObject(value)

  // TODO: Detect malformed JSON input and throw MalformedError.
  if (!detectJsonFeed(json)) {
    throw new DetectError(locales.errors.invalidFeedFormat)
  }

  const parsed = parseFeed(json, options)

  if (!parsed) {
    throw new ParseError(locales.errors.invalidFeedFormat)
  }

  return parsed as JsonFeed.Feed<TDate>
}
